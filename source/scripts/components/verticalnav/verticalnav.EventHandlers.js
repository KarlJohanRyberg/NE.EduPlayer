/// <reference path="../../NE.Navigation.js" />
/// <reference path="../../NE.UI.js" />

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
if (NE.Plugin.verticalnav === null || NE.Plugin.verticalnav === undefined) { NE.Plugin.verticalnav = {}; }

NE.Plugin.verticalnav.EventHandlers = (function () {

    //////////////////////
    //
    //  Private fields 
    //
    /////////////////////

    var _clickTimer;

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

    function _bounce(value, instance) {

        var panel = $('#' + instance.PanelSettings.ID).find('.NE-vert-page-holder').first();
        var scrollPos = (-instance.CurrentSlide * 100);
    
        panel.stop().animate({ 'margin-left': (scrollPos + value) + '%' }, 200, function () {
            panel.animate({ 'margin-left': scrollPos + '%' }, 100);
        });

    }

    function _markIcon(instance) {
        var panel = $('#' + instance.PanelSettings.ID).find('.NE-vert-page-icons').first();
        var icons = panel.find('.icon');
        icons.removeClass('active');
        icons.eq(instance.CurrentSlide).addClass('active');
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



        //////////////////////
        //
        //  Public functions 
        //
        /////////////////////

        NavPrev: function (instance) {
            if (instance.CurrentSlide > 0) {
                instance.CurrentSlide--;
                this.NavTo(instance);
            }
            else {
                _bounce(10, instance);
            }
        },

        NavNext: function (instance) {
            if (instance.CurrentSlide < instance.VisibleSlides.length - 1) {
                instance.CurrentSlide++;
                this.NavTo(instance);
            }
            else {
                _bounce(-10, instance);
            }
        },

        NavTo: function (instance) {
            var panel = $('#' + instance.PanelSettings.ID).find('.NE-vert-page-holder').first();
            var currentSlideDiv = $('#' + instance.PanelSettings.ID + '-' + instance.CurrentSlide);
            panel.stop().animate({ 'margin-left': (-instance.CurrentSlide * 100) + '%' }, 300);
            _markIcon(instance);
        },

        eof: null
    };

})();

