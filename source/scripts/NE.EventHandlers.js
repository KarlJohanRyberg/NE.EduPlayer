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

    function _oneChapterLoaded(i_chapter) {
        i_chapter.OnLoaded = function (e) {
            _chaptersLoaded++;
            if (_chaptersLoaded >= NE.CourseTree.chapters.length - 1) {
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
                    settings: {}
                }, function (i_instance) {
                    i_instance.Init();
                });
            });

            for (var i = 0; i < NE.CourseTree.chapters.length; i++) {
                NE.Plugin.Load({
                    name: 'chapter',
                    node: $('<div></div>').appendTo('#' + NE.Constants.SCROLL_CONTAINER_ID),
                    settings: {
                        index: i,
                        chapter: NE.CourseTree.chapters[i]
                    }
                }, _oneChapterLoaded);
            }
        },

        WindowResize: function () {
            NE.UI.AcceptScrollEvent = false;

            $('#' + NE.Constants.MAIN_CONTENT_CONTAINER_ID).css('visibility', 'hidden');
            NE.UI.DisableContentScroll();

            clearTimeout(_resizeTimer);
            _resizeTimer = setTimeout(function () {
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
 
            NE.Plugin['NE-top-chapter-navigation'].Update();

            NE.SCORM.NavigateToBookmark();

        },

        OnPageScroll: function (i_item, scrollObj) {

            if (!i_item.is(':visible')) return;

            var pageIndex = parseInt(i_item.data('index'), 10);
            var chapterIndex = parseInt(i_item.data('chapter'), 10);

            if (scrollObj.visibility > 0.8 && pageIndex == NE.CourseTree.chapters[chapterIndex].pages.length - 1) {
                var sectionID = NE.CourseTree.SCO_name + '_' + chapterIndex;
                NE.LMS.Sections.SetState(sectionID, 'completed');
            }

            if (!NE.UI.AcceptScrollEvent) return;

            if (scrollObj.visibility > 0.8 && i_item.attr('id') != NE.Navigation.CurrentPageDiv().attr('id')) {

                NE.Navigation.CurrentChapterIndex = chapterIndex;
                NE.Navigation.CurrentPageIndex = pageIndex;

                NE.Navigation.ToPage(NE.Navigation.CurrentPageIndex, NE.Navigation.CurrentChapterIndex);

                clearTimeout(_bookmarkTImer);

                _bookmarkTImer = setTimeout(function () {
                    if (NE.CourseTree.chapters[chapterIndex].pages[pageIndex].keepprogress !== false) {
                        NE.LMS.Bookmark.SetBookmark(i_item.attr('id'));
                        NE.UI.SetNavigationButtons();
                    }
                });

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

            $('.NE-video').each(function () {
                $(this)[0].pause();
            });

            NE.UI.SwitchTopMenu();
            NE.UI.SetNavigationButtons();

            if (!NE.SCORM.InitBookmark) {
                NE.LMS.Bookmark.SetBookmark(NE.Navigation.CurrentPageDiv().attr('id'));
            }

        },

        AfterPageScroll: function () {
            NE.Plugin['NE-top-chapter-navigation'].Update();
        },

        ChapterLinkCLick: function (i_item, e) {
            if (i_item.hasClass('disable')) return;

            var chapterIndex = parseInt(i_item.data('chapter'), 10);
            var chapterDIv = $('#' + NE.Constants.CHAPTER_ID_PREFIX + chapterIndex);
            if (chapterDIv.hasClass('hidden') || chapterDIv.hasClass('NE-nav-hidden')) return;

            NE.Navigation.ToChapter(chapterIndex);
            NE.UI.ScrollToPage();
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
