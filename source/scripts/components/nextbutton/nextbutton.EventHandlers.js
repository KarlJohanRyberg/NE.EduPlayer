/// <reference path="../../NE.Navigation.js" />

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
if (NE.Plugin.nextbutton === null || NE.Plugin.nextbutton === undefined) { NE.Plugin.nextbutton = {}; }

NE.Plugin.nextbutton.EventHandlers = (function () {

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


        OnClick: function (sender, e) {

            var that = sender;
    
            if(that.hasClass('disable')) return;

            var parentToHide = that.closest('.NE-hidden-visited').first();
            if (parentToHide.length > 0) {

                that.addClass('active');

                parentToHide.slideUp(300, function () {
                    parentToHide.addClass('hidden');
                });
            }

            var parentPage = that.parents('.NE-page').first();

            NE.Navigation.CurrentChapterIndex = parseInt(parentPage.data('chapter'), 10);
            NE.Navigation.CurrentPageIndex = parseInt(parentPage.data('index'), 10);
     
            NE.Navigation.Next();
            NE.UI.RevealPage();

            e.preventDefault();
            return false;

        },

        eof: null
    };

})();

