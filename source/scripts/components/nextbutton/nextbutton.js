/// <reference path="../../libraries/masala-ux/dist/js/jquery.min.js" />
/// <reference path="../../NE.Plugin.js" />
/// <reference path="../../../../content/structure/courseTree.js" />
/// <reference path="revealbutton.EventHandlers.js" />

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

NE.Plugin.nextbutton = function (i_params) {

    //////////////////////
    //
    //  Private fields 
    //
    /////////////////////

    var _params = i_params;
    var _settings = {};
    var _MyDOMContent;

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

        Name: 'nextbutton',
        Dependencies: [
            'nextbutton.css',
            'nextbutton.EventHandlers.js'
        ],

        //////////////////////
        //
        //  Public functions 
        //
        /////////////////////

        Init: function () {

            _settings = _params.settings;

            NE.Plugin.ApplyTemplate(this, function (data) {
                _MyDOMContent = $(data);
                _addToDOM(_MyDOMContent);

                if (_settings.html) _MyDOMContent.first().html(_settings.html);

                _MyDOMContent.first().on('click', function (e) {
                    if (me.ClickOverride) {
                        me.ClickOverride(_MyDOMContent.first(), e, NE.Plugin.nextbutton.EventHandlers.OnClick);
                    }
                    else {
                        NE.Plugin.nextbutton.EventHandlers.OnClick($(this), e);
                    }
                });
                me.OnLoaded();
            });

        },

        Render: function (params) {
            var data = params[0].data;
            var initClasses = _settings.initclasses ? ' ' + _settings.initclasses : '';
            var iconClass = _settings.iconclass || 'fa-angle-down';
            data = data.replace(/{ID}/g, _settings.ID);
            data = data.replace(/{text}/g, _settings.text);
            data = data.replace(/{initClasses}/g, initClasses);
            data = data.replace(/{iconclass}/g, iconClass);
         
            return data;
        },

        OnLoaded: function (e) { },
        ClickOverride: null,

        eof: null
    };

    return me;

};

