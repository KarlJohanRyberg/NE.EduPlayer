﻿/// <reference path="NE.Constants.js" />

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

NE.Scroll = (function () {

    //////////////////////
    //
    //  Private fields 
    //
    /////////////////////



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

     

        //////////////////////
        //
        //  Public functions 
        //
        /////////////////////

        ToElementY: function (jqElement, anchor, padding, callback) {
            
            if (typeof padding === 'function') {
                callback = padding;
                padding = null;
            }

            var parentPage = $('#' + NE.Constants.SCROLL_CONTAINER_ID); //jqElement.parents('.NE-chapter').first();
            var viewPort = $('#' + NE.Constants.MAIN_CONTENT_CONTAINER_ID);

            var viewTarget = viewPort.offset().top;// + 30;
            var scrollAnchor = jqElement.offset().top;

            if (!anchor || (anchor && anchor.toString().toLowerCase() == 'middle')) {
                viewTarget += viewPort.innerHeight() / 2;
                scrollAnchor += jqElement.outerHeight() / 2;
            }
            else if (anchor && anchor.toString().toLowerCase() == 'bottom') {
                viewTarget += viewPort.innerHeight();
                scrollAnchor += jqElement.outerHeight();
            }


            var diff = scrollAnchor - viewTarget;
            diff -= padding || 0;
            var time = Math.abs(diff);
            time = Math.min(Math.max(time, 100), 500);

            parentPage.animate({ 'scrollTop': '+=' + diff + 'px' }, time, function () {
                if (callback) callback();
            });

        }

    };

})();

