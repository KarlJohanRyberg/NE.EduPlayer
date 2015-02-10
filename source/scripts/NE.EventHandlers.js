/// <reference path="NE.Constants.js" />
/// <reference path="NE.Navigation.js" />
/// <reference path="NE.UI.js" />
/// <reference path=//utb.ne.se/neutbshared/js/NE.LMS.js" />

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

NE.EventHandlers = (function () {

    //////////////////////
    //
    //  Private fields 
    //
    /////////////////////

    var _bookmarkTImer;
    var _resizeTimer;
    var _chaptersLoaded = 0;
    var _currentPage = '';

    function _oneChapterLoaded(i_chapter) {
        i_chapter.OnLoaded = function (e) {

            _chaptersLoaded++;
            if (_chaptersLoaded == NE.CourseTree.chapters.length - 1) {
                NE.EventHandlers.ChaptersLoaded();
            }

        };
        i_chapter.Init();
    }

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

        StructureLoaded: function () {

            $('.NE-plugin-container').each(function () {
                NE.Plugin.Load({
                    name: $(this).data('plugin'),
                    node: $(this),
                    settings: NE.Plugin.ParseSettings($(this).data('settings'))
                }, function (i_instance) {
                    i_instance.Init();
                });
            });

            for (var i = 0; i < NE.CourseTree.chapters.length; i++) {
                NE.Plugin.Load({
                    name: 'chapter',
                    node: $('<div></div>').appendTo('#' + NE.Constants.SCROLL_CONTAINER_ID),
                    settings: {
                        ID: NE.Constants.CHAPTER_ID_PREFIX + i,
                        index: i,
                        chapter: NE.CourseTree.chapters[i]
                    }
                }, _oneChapterLoaded);
            }
        },

        WindowResize: function (e) {

            var focusTagName = $(':focus') && $(':focus').prop("tagName") ? $(':focus').prop("tagName").toUpperCase() : '';
            if (focusTagName == 'TEXTAREA' || focusTagName == 'INPUT') return;

            NE.UI.AcceptScrollEvent = false;

            $('#' + NE.Constants.MAIN_CONTENT_CONTAINER_ID).css('visibility', 'hidden');
            NE.UI.DisableContentScroll();

            clearTimeout(_resizeTimer);
            _resizeTimer = setTimeout(function () {

                if (!NE.UI.Loaded) return;

                $('#' + NE.Constants.MAIN_CONTENT_CONTAINER_ID).css('visibility', 'visible');

                NE.UI.EnableContentScroll();

                NE.UI.ScrollToPage(true);
                NE.UI.SwitchTopMenu();

            }, 500);
        },

        ChaptersLoaded: function () {

            NE.UI.Setup();

            NE.UI.AcceptScrollEvent = false;
            NE.SCORM.RegisterSections();

            NE.LMS.Sections.SetState(NE.CourseTree.SCO_name + '_0', 'completed');

            NE.UI.PreHide();
            NE.SCORM.Unlockhistory();


            $('.NE-scroll-watched').on('sw-scrolled', function (e, scrollObj) {
                NE.EventHandlers.OnPageScroll($(this), scrollObj);
            });

            $('.NE-scroll-watched').ScrollWatch({
                axis: 'y',
                prioritize: 'max',//'partofviewport'//'partofobject'
                swWindow: '#' + NE.Constants.MAIN_CONTENT_CONTAINER_ID,
                swDocument: '#' + NE.Constants.SCROLL_CONTAINER_ID
            });


            $('#' + NE.Constants.MAIN_CONTENT_CONTAINER_ID).css('visibility', 'visible');

            NE.SCORM.NavigateToBookmark();

            NE.Plugin['NE-top-chapter-navigation'].Update();
            NE.UI.Ready();

            $('#NE-preloader').hide();

            NE.UI.PrepareVideo(NE.Navigation.CurrentPageDiv());

        },

        OnPageScroll: function (i_item, scrollObj) {

            if (!i_item.is(':visible')) return;

            var ismostVisible = scrollObj.visibility > 0.8;
            if (!ismostVisible) return;


            var pageIndex = parseInt(i_item.data('index'), 10);
            var chapterIndex = parseInt(i_item.data('chapter'), 10);


            var isNewPage = i_item.attr('id') != _currentPage;
            var isLastPage = pageIndex == NE.CourseTree.chapters[chapterIndex].pages.length - 1;

            if (!NE.UI.AcceptScrollEvent) return;

            if (ismostVisible && isNewPage) {

                NE.Navigation.CurrentChapterIndex = chapterIndex;
                NE.Navigation.CurrentPageIndex = pageIndex;

                NE.Navigation.ToPage(NE.Navigation.CurrentPageIndex, NE.Navigation.CurrentChapterIndex);
                _currentPage = NE.Navigation.CurrentPageDiv().attr('id');

                clearTimeout(_bookmarkTImer);

                _bookmarkTImer = setTimeout(function () {
                    if (NE.CourseTree.chapters[chapterIndex].pages[pageIndex].keepprogress !== false) {
                        NE.LMS.Bookmark.SetBookmark(i_item.attr('id'));
                        NE.UI.SetNavigationButtons();
                    }
                }, 300);

            }


        },

        NavBackBtnClick: function (i_item) {
            NE.Navigation.Previous();
            NE.UI.ScrollToPage();
            i_item.blur();
        },

        NavForwardBtnClick: function (i_item) {
            NE.Navigation.Next();
            NE.UI.ScrollToPage();
            i_item.blur();
        },

        Navigation: function (e) {

            var prevPage = NE.Navigation.MockPrev();
            if (prevPage.chapter != -1) {
                NE.UI.HideVIsitedItems(prevPage.chapter, prevPage.page);
            }

            var sectionID = NE.CourseTree.SCO_name + '_' + NE.Navigation.CurrentChapterIndex;
            if (NE.LMS.Sections.GetState(sectionID).toLowerCase() !== 'completed') {
                NE.LMS.Sections.SetState(sectionID, 'completed');
            }


            $('.NE-video').each(function () {
                $(this)[0].pause();
            });

            NE.UI.SwitchTopMenu();
            NE.UI.SetNavigationButtons();

            if (!NE.SCORM.InitBookmark) {
                NE.LMS.Bookmark.SetBookmark(NE.Navigation.CurrentPageDiv().attr('id'));
            }
         
            NE.UI.PrepareVideo(NE.Navigation.CurrentPageDiv());
            NE.Plugin['NE-top-chapter-navigation'].Update();
        },

        AfterPageScroll: function () {
            NE.Plugin['NE-top-chapter-navigation'].Update();
        },

        ChapterLinkCLick: function (i_item, e) {
            if (i_item.hasClass('disable') || i_item.hasClass('current')) return;

            var chapterIndex = parseInt(i_item.data('chapter'), 10);
            var chapterDIv = $('#' + NE.Constants.CHAPTER_ID_PREFIX + chapterIndex);
            //  if (chapterDIv.hasClass('hidden') || chapterDIv.hasClass('NE-nav-hidden')) return;

            for (var i = NE.Navigation.CurrentChapterIndex; i < chapterIndex; i++) {
                NE.UI.Unlock(i);
            }
            NE.UI.Unlock(chapterIndex, 0);

            NE.Navigation.ToChapter(chapterIndex);

            NE.UI.RevealPage();

        },

        KeyUp: function (e) {
            var k = e.which;
            if (k == 13 || k == 32 || k == 34 || k == 39) {
                NE.Navigation.Next();
            }
            else if (k == 8 || k == 33 || k == 37) {
                NE.Navigation.Previous();
            }
            e.preventDefault();
            return false;
        },


        //////////////////////
        //
        //  Public functions 
        //
        /////////////////////


        eof: null
    };

})();
