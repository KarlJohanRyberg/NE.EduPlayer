/// <reference path="../../NE.Navigation.js" />
/// <reference path="../../NE.UI.js" />

/////////////////////////////////////////////////////////////////////
//
//  TYPE: 
//  NAME: 
//  NAMESPACE: 
//  
//  SUMMARY
//      
//  
//  PUBLIC FIELDS  
//      
//
//  PUBLIC FUNCTIONS
//      
//
//  DEPENDENCIES
//      
//
//////////////////////////////////////////////////////////////////////

// Ensure that the NE namespace is avaiable
if (NE === null || NE === undefined) { var NE = {}; }
if (NE.Plugin === null || NE.Plugin === undefined) { NE.Plugin = {}; }
if (NE.Plugin.topmenu === null || NE.Plugin.topmenu === undefined) { NE.Plugin.topmenu = {}; }

NE.Plugin.topmenu.EventHandlers = (function () {

    //////////////////////
    //
    //  Private fields 
    //
    /////////////////////

    var _clickTimer;

    //////////////////////
    //
    //  Initiation
    //
    /////////////////////

    (function () {



    })();

    //////////////////////
    //
    //  Private functions 
    //
    /////////////////////

    function _openChapterPanel(i_item) {

        var chapterMenuDiv = $('#NE-top-chapter-navigation');
        var menuHeight = 0;

        chapterMenuDiv.find('.NE-chapterlink-collection').each(function () {

            var itemHeight = $(this).outerHeight();

            if ($('#isXS').is(':visible')) {
                menuHeight += itemHeight;
            }
            else {
                menuHeight = itemHeight > menuHeight ? itemHeight : menuHeight;
            }

        });

        $('#NE-top-backdrop').fadeTo(0, 0).fadeTo(300, 0.65);
        
        NE.UI.DisableContentScroll();

        i_item.parent().addClass('active');

        var max = parseInt(chapterMenuDiv.css('max-height'));
        var isScroll = 'hidden';
        if (max < menuHeight) {
            menuHeight = max;
            isScroll = 'auto';
        }

        chapterMenuDiv.css({
            'border-top-width': '1px',
            'height': menuHeight + 'px',
            'overflow': isScroll
        }).toggleClass('open');

        NE.UI.ToggleBackNavButtons(false);
        NE.UI.ToggleForwardNavButtons(false);

    }

    function _closeChapterPanel(i_item) {
        $('#NE-top-backdrop').fadeTo(300, 0, function () {
            $(this).hide();
            i_item.parent().removeClass('active');
            NE.UI.EnableContentScroll();
        });
        var chapterMenuDiv = $('#NE-top-chapter-navigation');
        chapterMenuDiv.css({
            'border-top-width': '0px',
            'height': '0px'
        }).toggleClass('open');
        NE.UI.ToggleBackNavButtons(true);
        NE.UI.ToggleForwardNavButtons(true);
    }

    //////////////////////
    //
    //  Return object
    //
    /////////////////////

    return {

        //////////////////////
        //
        //  Public fields 
        //
        /////////////////////



        //////////////////////
        //
        //  Public functions 
        //
        /////////////////////

        WindowResize: function () {
            if ($('#NE-top-chapter-navigation').hasClass('open')) {
                $('.NE-chapter-label').click();
            }
        },

        ChapterLabelClick: function (i_item) {
            if (!i_item.is(':visible')) return;

            var now = new Date();
            var delay = _clickTimer ? now - _clickTimer : 1000;
            _clickTimer = now;

            if (delay < 500) return;

            var chapterMenuDiv = $('#NE-top-chapter-navigation');

            if (!chapterMenuDiv.hasClass('open')) {
                _openChapterPanel(i_item);

            }
            else {
                _closeChapterPanel(i_item);
            }
            i_item.blur();
        },

        ChapterLinkClick: function (i_item) {
            if (i_item.hasClass('disable') || i_item.hasClass('current')) return;
            var chapterIndex = parseInt(i_item.data('chapter'), 10);
            var chapterDiv = $('#' + NE.Constants.CHAPTER_ID_PREFIX + chapterIndex);
         
          // if (chapterDiv.hasClass('hidden') || chapterDiv.hasClass('NE-nav-hidden')) return;
            
            
            NE.UI.EnableContentScroll();

            for (var i = NE.Navigation.CurrentChapterIndex; i < chapterIndex; i++) {
                NE.UI.Unlock(i);
            }
            NE.UI.Unlock(chapterIndex, 0);

            NE.Navigation.ToChapter(chapterIndex);
            NE.UI.ScrollToPage();

            $('.NE-chapter-label').click();

        },

        OverlayClick: function () {
            $('.NE-chapter-label').click();
        },

        UpdateChapterMenu: function () {
            var menuIitem = $('.NE-chapterlink-' + NE.Navigation.CurrentChapterIndex).first();
            if (menuIitem.length) $('#NE-chapter-label-big').html(menuIitem.find('.link-label').first().html() + NE.Constants.HEADER_CHAPTER_NAV_ICON);
        },

        eof: null
    };

})();

