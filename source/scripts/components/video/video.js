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

NE.Plugin.video = function (i_params) {

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

    function _render(data) {

        data = data.replace(/{ID}/g, _settings.ID);
        data = data.replace(/{poster}/g, _settings.poster);
        data = data.replace(/{video}/g, _settings.video);

        return data;

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

        Name: 'video',
        Dependencies: [
            'video.css'
        ],

        //////////////////////
        //
        //  Public functions 
        //
        /////////////////////

        Init: function () {

            _settings = _params.settings;

            NE.Plugin.ApplyTemplate(this, function (data) {
                _MyDOMContent = $(_render(data));
                _addToDOM(_MyDOMContent);

                _MyDOMContent.first().on('click', function (e) {
                    if ($(this).hasClass('playing')) return;

                    var vidHTML = '';
                    vidHTML += '<video class="NE-video" width="640" controls="controls" autoplay="autoplay" poster="' + _settings.poster + '">';
                    vidHTML += '<source src="' + _settings.video + '" type="video/mp4"/>';
                    vidHTML += '</video>';

                    $(this).html(vidHTML);

                    $(this).addClass('playing');
                });

                me.OnLoaded();
            });

        },


        OnLoaded: function (e) { },

        eof: null
    };

    return me;

};

