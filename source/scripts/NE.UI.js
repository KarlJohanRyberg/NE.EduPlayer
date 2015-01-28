/// <reference path="NE.Navigation.js" />
/// <reference path="NE.Constants.js" />
/// <reference path="../../content/structure/courseTree.js" />
/// <reference path="libraries/masala-ux/dist/js/jquery.min.js" />
/// <reference path="NE.Scroll.js" />

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

NE.UI = (function () {

    //////////////////////
    //
    //  Private fields 
    //
    /////////////////////

    var _topMenuOffset = 0;
    var _scrollbarWidth = null;
    var _scrollHintDismissed = false;
    var _hintTImer = null;

    var _onUIReadyKey = 'a716ed95-dc66-468f-9802-a2203494a7f5';
    var _eventOwnerKey = Math.random() + '' + Math.random();


    //////////////////////
    //
    //  Initiation
    //
    /////////////////////

    (function () {

        NE.Events.Register(_eventOwnerKey, _onUIReadyKey);

    })();

    //////////////////////
    //
    //  Private functions 
    //
    /////////////////////

    function _getScrollbarWidth() {
        if (_scrollbarWidth !== null) return _scrollbarWidth;

        var outer = document.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

        document.body.appendChild(outer);

        var widthNoScroll = outer.offsetWidth;
        // force scrollbars
        outer.style.overflow = "scroll";

        // add innerdiv
        var inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);

        var widthWithScroll = inner.offsetWidth;

        // remove divs
        outer.parentNode.removeChild(outer);

        _scrollbarWidth = widthNoScroll - widthWithScroll;
        return _scrollbarWidth;
    }


    function _scrollHintAnimate(i_scrollElem, i_scrollTop) {

        clearTimeout(_hintTImer);

        if (
            i_scrollElem.scrollTop() != i_scrollTop ||
            _scrollHintDismissed ||
            (NE.Navigation.CurrentChapterIndex > 0 || NE.Navigation.CurrentPageIndex > 0)
            ) {
            $('#NE-scroll-hint').removeClass('active').addClass('hidden');
            _scrollHintDismissed = true;
            return;
        }

        _hintTImer = setTimeout(function () {
            _scrollHintAnimate(i_scrollElem, i_scrollTop);
        }, 100);

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

        ON_READY: _onUIReadyKey,
        AcceptScrollEvent: false,

        //////////////////////
        //
        //  Public functions 
        //
        /////////////////////

        Setup: function () {
            if (!_scrollHintDismissed) {
                // _hintTImer = setTimeout(NE.UI.ScrollHint, 5000);
            }
            $('#' + NE.Constants.FLOATING_HEADER_ID).css('right', _getScrollbarWidth() + 'px');
            $('#NE-top-backdrop').css('right', _getScrollbarWidth() + 'px');
            NE.UI.SwitchTopMenu();
        },

        PreHide: function () {
            var isHidden = false;
            $('.NE-page').each(function () {
                var page = $(this);
                if (page.hasClass('NE-nav-hidden')) {
                    isHidden = true;
                }
                else if (isHidden) {
                    page.addClass('NE-nav-hidden');
                }
            });
            $('.NE-chapter').each(function () {
                var chapter = $(this);
                var pages = chapter.find('.NE-page');
                var hiddenPages = chapter.find('.NE-nav-hidden');

                if (pages.length && pages.length == hiddenPages.length) {
                    chapter.addClass('NE-nav-hidden');
                }
            });

        },

        Ready: function () {
            NE.Events.Execute(_eventOwnerKey, _onUIReadyKey, {});
        },

        HideVIsitedItems: function (i_chapter, i_page) {

            if (i_page === null || i_page === undefined) {
                $('#' + NE.Constants.CHAPTER_ID_PREFIX + i_chapter)
                    .find('.NE-hidden-visited')
                    .fadeOut(200, function () {
                        $(this).addClass('hidden');
                    });
            }
            else {
                $('#' + NE.Constants.PAGE_ID_PREFIX + i_chapter + '-' + i_page)
                    .find('.NE-hidden-visited')
                    .fadeOut(200, function () {
                        $(this).addClass('hidden');
                    });
            }
        },

        Unlock: function (i_chapter, i_page) {
       

            for (var i = i_chapter; i < NE.CourseTree.chapters.length; i++) {
                var oneVisible = false;
                var chapter = NE.CourseTree.chapters[i];

                for (var j = i_page || 0; j < chapter.pages.length; j++) {

                    var page = chapter.pages[j];
                    var onlyChapterButAfter = i_page === undefined && i > i_chapter;
                    var pageAndAfter = i_page !== undefined && (j > i_page || i > i_chapter);
 
                    if (page.stopprogress && (onlyChapterButAfter || pageAndAfter)) {
                        if (oneVisible) $('#NE-chapter-' + i).removeClass('NE-nav-hidden');
                        return;
                    }
                    if (NE.CourseTree.chapters[i].pages[j].keepprogress !== false) {
 
                        $('#NE-page-' + i + '-' + j).removeClass('NE-nav-hidden');
                        $('#NE-page-' + i + '-' + j).find('.NE-nav-hidden').removeClass('NE-nav-hidden');
                    }
                    oneVisible = true;
                }
                if (oneVisible) $('#NE-chapter-' + i).removeClass('NE-nav-hidden');
                i_page = 0;
            }

        },

        ToggleForwardNavButtons: function (onoff) {
            if (!onoff) {
                $('.NE-nav-forward').addClass('disable');
            } else {
                $('.NE-nav-forward').removeClass('disable');
                NE.UI.SetNavigationButtons();
            }
        },

        ToggleBackNavButtons: function (onoff) {
            if (!onoff) {
                $('.NE-nav-back').addClass('disable');
            } else {
                $('.NE-nav-back').removeClass('disable');
                NE.UI.SetNavigationButtons();
            }
        },

        SwitchTopMenu: function () {

            // if ($('#' + NE.Constants.SCROLL_CONTAINER_ID).css('overflow') == 'hidden') return;

            var menu = $('#' + NE.Constants.FLOATING_HEADER_ID);
            var isXS = $('#isXS').is(':visible');
            if ((NE.Navigation.CurrentPageIndex > 0 || NE.Navigation.CurrentChapterIndex > 0) || isXS) {
                _topMenuOffset = 83;
                menu.removeClass('NE-offcanvas');
            }
            else {
                _topMenuOffset = 0;
                menu.addClass('NE-offcanvas');
            }
            var contentOffset = isXS && NE.Navigation.CurrentChapterIndex === 0 && NE.Navigation.CurrentPageIndex === 0 ? _topMenuOffset : 0;
            $('#' + NE.Constants.CHAPTER_ID_PREFIX + '0').css('padding-top', contentOffset + 'px');

        },

        SetNavigationButtons: function () {
            if (NE.Navigation.CurrentPageIndex === 0 && NE.Navigation.CurrentChapterIndex === 0) {
                $('.NE-nav-back').addClass('disable');
            }
            else {
                $('.NE-nav-back').removeClass('disable');
            }

            if (NE.Navigation.IsAtLast()) {
                $('.NE-nav-forward').addClass('disable');
            }
            else {
                $('.NE-nav-forward').removeClass('disable');
            }
        },

        RevealPage: function (i_skipAnimation, i_stay) {
            NE.UI.AcceptScrollEvent = false;
            var currentPage = NE.Navigation.CurrentPageDiv();
            var animTime = i_skipAnimation ? 0 : 300;
            var doNotScroll = i_stay || false;

            if (currentPage.hasClass('hidden') || currentPage.hasClass('NE-nav-hidden')) {
                currentPage.parent('.NE-chapter').removeClass('NE-nav-hidden hidden');
                currentPage.find('.NE-page').removeClass('NE-nav-hidden');
                currentPage.removeClass('NE-nav-hidden hidden').slideUp(0).slideDown(animTime, 'swing', function () {
                    NE.UI.Unlock(NE.Navigation.CurrentChapterIndex, NE.Navigation.CurrentPageIndex);
                    if(!doNotScroll) NE.UI.ScrollToPage(i_skipAnimation);
                });
            }
            else {
                if (!doNotScroll) NE.UI.ScrollToPage(i_skipAnimation);
            }
        },

        ScrollToPage: function (i_skipAnimation) {

            if ($('#' + NE.Constants.SCROLL_CONTAINER_ID).css('overflow') == 'hidden') return;

            NE.UI.AcceptScrollEvent = false;

            var animTime = i_skipAnimation ? 0 : 300;
            var currentPage = NE.Navigation.CurrentPageDiv();
            var currentChapter = NE.Navigation.CurrentChapterDiv();
            var scroller = $('#' + NE.Constants.SCROLL_CONTAINER_ID);
           
            scroller.animate({ 'scrollTop': '+=' + (currentChapter.position().top + currentPage.position().top - _topMenuOffset) }, animTime, function () {
                NE.EventHandlers.AfterPageScroll();
                NE.UI.AcceptScrollEvent = true;
            });


        },

        ScrollHint: function () {
            var scroller = $('#' + NE.Constants.SCROLL_CONTAINER_ID);
            $('#NE-scroll-hint').removeClass('hidden').addClass('active');
            _scrollHintAnimate(scroller, scroller.scrollTop());
        },

        EnableContentScroll: function () {
            $('#' + NE.Constants.SCROLL_CONTAINER_ID).css({
                'overflow-y': 'auto',
                '-webkit-overflow-scrolling': 'touch'
            });
        },

        DisableContentScroll: function () {
            $('#' + NE.Constants.SCROLL_CONTAINER_ID).css({
                'overflow-y': 'hidden',
                '-webkit-overflow-scrolling': 'hidden'
            });
        },

        eof: null
    };


})();

