/// <reference path="NE.Events.js" />
/// <reference path="NE.Constants.js" />

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

NE.Navigation = (function () {

    //////////////////////
    //
    //  Private fields 
    //
    /////////////////////

    var _onNavigationKey = '69133ac8-a5ec-4d67-a137-2916e629a0b1';
    var _eventOwnerKey = Math.random() + '' + Math.random();

    //////////////////////
    //
    //  Initiation
    //
    /////////////////////

    (function () {

        NE.Events.Register(_eventOwnerKey, _onNavigationKey);

    })();

    //////////////////////
    //
    //  Private functions 
    //
    /////////////////////

    function _onNavigation(e) {
        NE.Events.Execute(_eventOwnerKey, _onNavigationKey, e);
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

        ON_NAVIGATION: _onNavigationKey,
        CurrentChapterIndex: 0,
        CurrentPageIndex: 0,

        //////////////////////
        //
        //  Public functions 
        //
        /////////////////////

        CurrentChapterDiv: function () {
            return $('#' + NE.Constants.CHAPTER_ID_PREFIX + (NE.Navigation.CurrentChapterIndex));
        },

        CurrentPageDiv: function () {
            return $('#' + NE.Constants.PAGE_ID_PREFIX + NE.Navigation.CurrentChapterIndex + '-' + NE.Navigation.CurrentPageIndex);
        },

        IsAtLast: function () {
            var isLastChapter = NE.Navigation.CurrentChapterIndex == NE.CourseTree.chapters.length - 1;
            var isLastPage = NE.Navigation.CurrentPageIndex == NE.CourseTree.chapters[NE.Navigation.CurrentChapterIndex].pages.length - 1;
            return isLastChapter && isLastPage;
        },

        ToChapter: function (index, preventNav) {
            if (index < 0 || index >= NE.CourseTree.chapters.length) return;
            NE.Navigation.CurrentChapterIndex = index;
            if (!preventNav) NE.Navigation.ToPage(0);
        },

        ToPage: function (index, chapter) {
            if (chapter) NE.Navigation.ToChapter(chapter, true);
            if (index < 0 || index >= NE.CourseTree.chapters[NE.Navigation.CurrentChapterIndex].pages.length) return;
            NE.Navigation.CurrentPageIndex = index;
            _onNavigation({
                page: NE.Navigation.CurrentPageIndex,
                chapter: NE.Navigation.CurrentChapterIndex
            });
        },

        MockNext: function () {
            var page = NE.Navigation.CurrentPageIndex + 1;
            var chapter = NE.Navigation.CurrentChapterIndex;
            if (page >= NE.CourseTree.chapters[chapter].pages.length) {
                chapter += 1;
                page = 0;
                if (chapter >= NE.CourseTree.chapters.length - 1) {
                    chapter = -1;
                    page = -1;
                }
            }
            return {
                chapter: chapter,
                page: page
            };
        },

        MockPrev: function () {
            var page = NE.Navigation.CurrentPageIndex - 1;
            var chapter = NE.Navigation.CurrentChapterIndex;
            if (page < 0) {
                chapter -= 1;
                if (chapter < 1) {
                    chapter = -1;
                    page = -1;
                }
                else {
                    page = NE.CourseTree.chapters[chapter].pages.length - 1;
                }
            }
            return {
                chapter: chapter,
                page: page
            };
        },

        Next: function () {
            var page = NE.Navigation.CurrentPageIndex + 1;
            if (page >= NE.CourseTree.chapters[NE.Navigation.CurrentChapterIndex].pages.length) {
                if (NE.Navigation.CurrentChapterIndex >= NE.CourseTree.chapters.length - 1) return;
                NE.Navigation.CurrentChapterIndex += 1;
                page = 0;
            }
            NE.Navigation.ToPage(page);
        },

        Previous: function () {
            var page = NE.Navigation.CurrentPageIndex - 1;
            if (page < 0) {
                if (NE.Navigation.CurrentChapterIndex < 1) return;
                NE.Navigation.CurrentChapterIndex -= 1;
                page = NE.CourseTree.chapters[NE.Navigation.CurrentChapterIndex].pages.length - 1;
            }
            NE.Navigation.ToPage(page);
        },

        eof: null
    };

})();



