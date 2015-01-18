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

// Ensure that the LOUISE namespace is avaiable
if (NE === null || NE === undefined) { var NE = {}; }
if (NE.Plugin === null || NE.Plugin === undefined) { NE.Plugin = {}; }

NE.Plugin.multiplechoice = function (i_params) {

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

        Name: 'multiplechoice',
        Dependencies: [
            'multiplechoice.css',
            'multiplechoice.EventHandlers.js'
        ],

        //////////////////////
        //
        //  Public functions 
        //
        /////////////////////

        Items: {},

        SelectOne: false,

        Init: function () {

            _settings = _params.settings;

            me.SelectOne = _settings.SelectOne && _settings.SelectOne === true;

            NE.Plugin.ApplyTemplate(this, function (data) {

                _MyDOMContent = $(data.replace(/{PanelID}/g, _settings.ID));
                _addToDOM(_MyDOMContent);

                for (var i = 0; i < _settings.options.length; i++) {
                    me.Items[_settings.OptionIDPrefix + i] = {
                        selected: false,
                        DOMItem: $('#' + _settings.OptionIDPrefix + i)
                    };
                }

                $('.NE-multiple-chioce-option').hover(
                    function () {
                        NE.Plugin.multiplechoice.EventHandlers.OptionEnter($(this), me);
                    },
                function () {
                    NE.Plugin.multiplechoice.EventHandlers.OptionLeave($(this), me);
                });

                $('.NE-multiple-chioce-option').on('click', function () {
                    NE.Plugin.multiplechoice.EventHandlers.OptionClick($(this), me);
                    me.OnChanged(me.Items);
                });

                me.OnLoaded();
            });

        },

        RenderOption: function (params) {

            var value = '';

            for (var i = 0; i < _settings.options.length; i++) {
                var option = _settings.options[i];
                var html = params[0].data;
                html = html.replace(/{optionID}/g, _settings.OptionIDPrefix + i);

                var imgBase = NE.Constants.CONTENT_BASE_PATH + '/content/media/';
                html = html.replace(/{optionImage}/g, imgBase + option.Images[0]);
                html = html.replace(/{hoverImage}/g, imgBase + option.Images[1]);
                html = html.replace(/{activeImage}/g, imgBase + option.Images[2]);

                for (var j = 1; j < option.Images.length; j++) {
                    var preLoad = new Image();
                    preLoad.src = NE.Constants.CONTENT_BASE_PATH + '/content/media/' + option.Images[j];
                }

                html = html.replace(/{optionitle}/g, option.Title);
                html = html.replace(/{optionText}/g, option.Text);
                value += html;
            }
            return value;
        },

        OnLoaded: function (e) { },
        OnChanged: function (e) { },

        eof: null
    };

    return me;

};

