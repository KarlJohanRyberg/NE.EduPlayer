/// <reference path="libraries/masala-ux/dist/js/jquery.min.js" />

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

NE.Net = (function () {

    //////////////////////
    //
    //  Private fields 
    //
    /////////////////////

    var _loadedFiles = {};
    var _callBackQueue = {};

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

    function _handleDuplicateFiles(i_file, i_callback) {

            if (_loadedFiles[i_file] !== 'loading') {
                if (i_callback) i_callback(_loadedFiles[i_file]);
            }
            else {
                if (_callBackQueue[i_file] === undefined) _callBackQueue[i_file] = [];
                _callBackQueue[i_file].push(i_callback);
            }

    }

    function _runCallbackQueue(i_file, i_data) {

        if (_callBackQueue[i_file] !== undefined) {
            for (var i = 0; i < _callBackQueue[i_file].length; i++) {
                _callBackQueue[i_file][i](i_data);
            }
        }

    }

    function _getFile(i_file, i_callback) {

        if (_loadedFiles[i_file] !== undefined) {
            _handleDuplicateFiles(i_file, i_callback);
            return;
        }

        _loadedFiles[i_file] = 'loading';

        $.get(i_file).done(function (i_data) {

            _loadedFiles[i_file] = i_data;
            if (i_callback) i_callback(i_data);
            _runCallbackQueue(i_file, i_data);

        });


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

        LoadTxtFile: function (i_file, i_callback) {
            _getFile(i_file, i_callback);
        },

        LoadJsonFile: function (i_file, i_callback) {
            _getFile(i_file, function (i_data) {
                i_callback(JSON.parse(i_data));
            });
        },

        AddScriptFile: function (i_file, i_callback) {
            if (_loadedFiles[i_file] !== undefined) {
                _handleDuplicateFiles(i_file, i_callback);
                return;
            }

            _loadedFiles[i_file] = 'loading';

            var tag = document.createElement("script");
            tag.rel = "text/javascript";
            $("body").append(tag);

            tag.onload = function () {
                _loadedFiles[i_file] = 'JS ' + i_file + ' loaded to DOM';
                if (i_callback) i_callback();
                _runCallbackQueue(i_file, null);
            };

            tag.src = i_file;
     
        },

        AddCssFile: function (i_file) {

            if (_loadedFiles[i_file] !== undefined) return;
            _loadedFiles[i_file] = 'CSS ' + i_file + ' loaded to DOM';
            var tag = document.createElement("link");
            tag.rel = "stylesheet";
            tag.href = i_file;
            $("head").append(tag);

        },

        GetExtension: function (i_file) {
            if (i_file.indexOf('.') == -1) return '';
            return i_file.split('.').slice(-1).toString().toLowerCase();
        },

        //////////////////////
        //
        //  Public functions 
        //
        /////////////////////



        eof: null
    };

})();

