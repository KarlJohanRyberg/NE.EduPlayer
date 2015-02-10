/// <reference path="../../libraries/masala-ux/dist/js/jquery.min.js" />
/// <reference path="../../NE.Plugin.js" />
/// <reference path="../../../../content/structure/courseTree.js" />
/// <reference path="../../NE.Events.js" />

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

NE.Plugin.chapter = function (i_params) {

    //////////////////////
    //
    //  Private fields 
    //
    /////////////////////

    var _params = i_params;
    var _settings = {};
    var _myDOMContent;

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

    function _addToDOM(i_content) {
        _params.node.replaceWith(i_content);
    }

    function _pageOnLoad(e) {
        if (e.chapter == _settings.index) {
            me.LoadedPages++;
            if (me.LoadedPages == _settings.chapter.pages.length) {
                me.OnLoaded({
                    guid: NE.CourseTree.chapters[_settings.index].guid,
                    index: _settings.index
                });
            }

        }
    }

    function _removeDuplicateRanPages(pageList) {

        var nums = [];
        for (var i = 0; i < pageList.length; i++) {
            for (var j = 0; j < NE.CourseTree.RandomSelectedPages.length; j++) {
                if (pageList[i] == NE.CourseTree.RandomSelectedPages[j]) {
                    nums.push(i);
                }
            }
        }

        for (var n = 0; n < nums.length; n++) {
            pageList.splice(nums[n] - n, 1);
        }

        return pageList;
    }

    //////////////////////
    //
    //  Return object
    //
    /////////////////////

    var me = {

        //////////////////////
        //
        //  Public fields 
        //
        /////////////////////

        Name: 'chapter',
        LoadedPages: 0,
        Dependencies: [
            'chapter.css'
        ],

        //////////////////////
        //
        //  Public functions 
        //
        /////////////////////

        Init: function () {

            _settings = _params.settings;

            NE.Plugin.ApplyTemplate(this, function (data) {

                _myDOMContent = $(data.replace(/{ID}/g, _settings.ID));
                _addToDOM(_myDOMContent);
                NE.Plugin.LoadAll(_myDOMContent.first(), _pageOnLoad);

            });

        },

        AddPages: function (params) {

            var returnVal = '';
            for (var i = 0; i < _settings.chapter.pages.length; i++) {

                var page = NE.CourseTree.chapters[_settings.index].pages[i];
                var dataFile = page.datafile;

                if (dataFile.indexOf('|') != -1) {

                    if (!NE.CourseTree.RandomSelectedPages) NE.CourseTree.RandomSelectedPages = [];

                    var alts = _removeDuplicateRanPages(dataFile.split('|'));
                    dataFile = alts[Math.floor(Math.random() * alts.length)];

                    NE.CourseTree.RandomSelectedPages.push(dataFile);
                }

                var contentFile = NE.Constants.CONTENT_BASE_PATH + '/content/data/' + dataFile + '.html';
                page.ID = NE.Constants.PAGE_ID_PREFIX + _settings.index + '-' + i;
                page.chapterIndex = _settings.index;
                page.index = i;
                page.datafile = contentFile;
                page.initclasses = 'NE-scroll-watched';

                returnVal += '<div class="NE-plugin-container" data-plugin="page" data-settings="' + escape(JSON.stringify(page)) + '"></div>';

            }
            return returnVal;

        },

        OnLoaded: function (e) { },

        eof: null
    };

    return me;

};

