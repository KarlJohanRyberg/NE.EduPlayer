
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

NE.Constants = (function () {

    //////////////////////
    //
    //  Private fields 
    //
    /////////////////////

    var _basePath;
    var _contentPath;

    //////////////////////
    //
    //  Initiation
    //
    /////////////////////

    (function () {

        var scripts = document.getElementsByTagName("script");
        var src = scripts[scripts.length - 1].src;

        _basePath = src.match(/^(http.+\/)/)[1];
        _basePath = _basePath.split('/').slice(0, -2).join('/');


        _contentPath = window.location.href.match(/^(http.+\/)/)[1];
        _contentPath = _contentPath.split('/').slice(0, -2).join('/');

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
     
        APPLICATION_BASE_PATH: _basePath,
        CONTENT_BASE_PATH: _contentPath,
        MAIN_CONTENT_CONTAINER_ID: 'NE-main-container',
        SCROLL_CONTAINER_ID: 'NE-scroller',
        CHAPTER_CLASS: 'NE-chapter',
        PAGE_ID_PREFIX: 'NE-page-',
        CHAPTER_ID_PREFIX: 'NE-chapter-',
        FLOATING_HEADER_ID: 'NE-top',
        CLOSE_BUTTON_ID: 'NE-top-close-btn',
        OF_CANVAS_TOP_CLASS: 'NE-offcanvas',
        HEADER_CHAPTER_NAV_ICON: '<i class="fa fa-navicon ml-xs"></i>',

        LIBRARIES:[
            'fastclick.js',
            'ScrollWatch.js'
        ],

        //////////////////////
        //
        //  Public functions 
        //
        /////////////////////



        eof: null
    };

})();

