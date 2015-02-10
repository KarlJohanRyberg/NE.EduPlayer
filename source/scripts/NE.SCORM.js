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

NE.SCORM = (function () {

    //////////////////////
    //
    //  Private fields 
    //
    /////////////////////

    var _progress;
    var _success;
    var _completion;

    //////////////////////
    //
    //  Initiation
    //
    /////////////////////

    (function () {


        NE.LMS.AddEvent(NE.LMS.ON_COMPLETION_STATUS_CHANGED, function (e) {
            _completion = e.status;
            _updateObjectives();
        }, this);


        NE.LMS.AddEvent(NE.LMS.ON_PROGRESS_MESSURE_CHANGED, function (e) {
            _progress = e.progress;
        }, this);


        NE.LMS.AddEvent(NE.LMS.ON_SUCCESS_STATUS_CHANGED, function (e) {
            _success = e.status;
        }, this);

    })();

    //////////////////////
    //
    //  Private functions 
    //
    /////////////////////

    function _updateObjectives() {

        try {

            var maxScore = NE.CourseTree.maxScore;

            if (maxScore && maxScore > 0) {
                _completion = NE.CourseTree.rawScore >= NE.CourseTree.minScore ? 'completed' : 'incomplete';
            }

            var current = NE.LMS.Objectives.Get(NE.CourseTree.SCO_name);
            var currentCompletionStatus = current && current.completion_status === 'completed' ? 'completed' : _completion;
            console.log(currentCompletionStatus);
            NE.LMS.Objectives.Set([{
                id: NE.CourseTree.SCO_name,
                completion_status: currentCompletionStatus || 'incomplete',
                success_status: _success || 'unknown',
                progress_measure: _progress || 0
            }]);
        }
        catch (ex) {
            console.warn('Failed to set status of objective: ' + NE.CourseTree.SCO_name);
        }
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

        InitBookmark: null,

        //////////////////////
        //
        //  Public functions 
        //
        /////////////////////

        NavigateToBookmark: function () {

            this.InitBookmark = NE.LMS.Bookmark.GetBookmark();

            if (this.InitBookmark) {
                var visitItem = $('#' + this.InitBookmark);

                NE.Navigation.CurrentChapterIndex = parseInt(visitItem.data('chapter'), 10);
                NE.Navigation.CurrentPageIndex = parseInt(visitItem.data('index'), 10);

                NE.Navigation.ToPage(NE.Navigation.CurrentPageIndex, NE.Navigation.CurrentChapterIndex);

                NE.UI.Unlock(NE.Navigation.CurrentChapterIndex, NE.Navigation.CurrentPageIndex);

                NE.UI.ScrollToPage(false);

                this.InitBookmark = null;
            }
            else {
                NE.UI.ScrollToPage(false);
            }

        },


        RegisterSections: function () {
            var sections = [];
            for (var i = 0; i < NE.CourseTree.chapters.length; i++) {
                sections.push(NE.LMS.Section(NE.CourseTree.SCO_name + '_' + NE.CourseTree.chapters[i].index));
            }
            NE.LMS.Sections.RegisterSections(sections);
        },


        Unlockhistory: function () {
            var sections = NE.LMS.Sections.GetSections();

            var lastChapterIndex;

            for (var i = 0; i < sections.length; i++) {
                if (sections[i].State == 'completed') {
                    var index = sections[i].ID.split('_');
                    index = parseInt(index[index.length - 1], 10);
                    NE.CourseTree.chapters[index].properties.locked = false;
                    NE.UI.Unlock(lastChapterIndex);
                    lastChapterIndex = index;
                }
            }

            if (lastChapterIndex) {
                NE.UI.HideVIsitedItems(lastChapterIndex);
            }

        },

        eof: null
    };

})();

