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
if (NE.Plugin.multiplechoice === null || NE.Plugin.multiplechoice === undefined) { NE.Plugin.multiplechoice = {}; }

NE.Plugin.multiplechoice.EventHandlers = (function () {

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


    function _setToState(jqObj, instance){
        
        var item = instance.Items[jqObj.attr('id')];
        var img = jqObj.find('img').first();

        if (item.selected) {
            jqObj.addClass('active');
            img.attr('src', img.data('activesrc'));
        }
        else{
            jqObj.removeClass('active');
            img.attr('src', img.data('src'));
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



        //////////////////////
        //
        //  Public functions 
        //
        /////////////////////


        OptionEnter: function (sender, instance) {
            
            sender.addClass('hover');
            var img = sender.find('img').first();

            img.attr('src', img.data('hoversrc'));


        },

        OptionLeave: function (sender, instance) {
            sender.removeClass('hover');
            _setToState(sender, instance);
        },

        OptionClick: function (sender, instance) {
            var item = instance.Items[sender.attr('id')];
            var state = !item.selected;

            if (instance.SelectOne) {
                for (var opt in instance.Items) {
                    var o = instance.Items[opt];
                    o.selected = false;
                    _setToState(o.DOMItem, instance);
                }
            }

            item.selected = state;
     
            _setToState(sender, instance);
        },


        eof: null
    };

})();

