/// <reference path="NE.Net.js" />
/// <reference path="NE.Constants.js" />

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

NE.Plugin = (function () {

    //////////////////////
    //
    //  Private fields 
    //
    /////////////////////

    var _basePath = NE.Constants.APPLICATION_BASE_PATH + '/scripts/components';
    var _itemEvents = {};

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

    function _resolvePath(i_path) {
        var pathParts = i_path.split('/');
        var name = pathParts.slice(-1).join('');
        return {
            path: pathParts.length > 1 ? pathParts.join('/') : _basePath + '/' + name,
            name: name
        };
    }


    function _findTokens(i_name, i_data) {
        var rgx = new RegExp('{' + i_name + '[.|\\s\\S]+?{\\/' + i_name + '}', 'g');
        var tokens = i_data.match(rgx);
        var objs = [];

        if (!tokens) return objs;

        for (var i = 0; i < tokens.length; i++) {
            var obj = _buildObj(i_name, tokens[i]);
            objs.push(obj);
        }


        return objs;
    }

    function _removeTokens(i_name, i_data) {
        var rgx = new RegExp('{' + i_name + '[.|\\s\\S]+?{\\/' + i_name + '}', 'g');
        return i_data.replace(rgx, '');
    }


    function _buildObj(i_name, i_token) {

        var nameRgx = new RegExp('{' + i_name + ':(.*?)}');
        var dataRgx = new RegExp('}(.|[\\s\\S]*?){\\/' + i_name + '}');

        var objName = i_token.match(nameRgx);
        objName = objName ? objName[1] : 'param';

        return {
            name: objName,
            data: i_token.match(dataRgx)[1]
        };
    }

    function _runFunction(i_plugin, i_name, i_params, i_data) {
        var rgx = new RegExp('{function:' + i_name + '}[.|\\s\\S]+?{\\/function}', 'g');
        return i_data.replace(rgx, i_plugin[i_name](i_params));
    }

    function _attachEventsToInstance(i_instanceID) {
        var eventInstance = _itemEvents[i_instanceID];
        if (eventInstance === null || eventInstance === undefined) return;

        for (var i = 0; i < eventInstance.eventList.length; i++) {
            var eventObj = eventInstance.eventList[i];

            NE.Plugin[i_instanceID][eventObj.event] = eventObj.callback;
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

        Load: function (i_initObj, i_callback) {

            var pn = _resolvePath(i_initObj.name);
            var baseFileName = pn.path + '/' + pn.name;
  
            NE.Net.AddScriptFile(baseFileName + '.js', function () {

                var instance = new NE.Plugin[pn.name](i_initObj);

                instance.BaseFileName = baseFileName;
            
                var instanceID = i_initObj.settings && i_initObj.settings.ID ?  i_initObj.settings.ID : Math.random().toString();

                NE.Plugin[instanceID] = instance;


                var depends = instance.Dependencies;
                if (depends) {
                    for (var i = 0; i < depends.length; i++) {
                        var ext = NE.Net.GetExtension(depends[i]);
                        switch (ext.toString().toLowerCase()) {
                            case 'css':
                                NE.Net.AddCssFile(pn.path + '/' + depends[i]);
                                break;
                            case 'js':
                                if (DEBUG) {
                                    NE.Net.AddScriptFile(pn.path + '/' + depends[i]);
                                    break;
                                }
                        }
                    }
                }

                _attachEventsToInstance(instanceID);

                if (i_callback) i_callback(instance);

            });

        },

        LoadAll: function (i_parentElem, i_onLoadCallback) {
            $('.NE-plugin-container', i_parentElem).each(function () {
                var plug = $(this);
                NE.Plugin.Load({
                    name: plug.data('plugin'),
                    node: plug,
                    settings: NE.Plugin.ParseSettings(plug.data('settings'))
                }, function (i_instance) {
                    i_instance.OnLoaded = i_onLoadCallback;
                    i_instance.Init();
                });

            });
        },

        ParseSettings: function (i_data) {
            if (!i_data) return {};
            try{
                return JSON.parse(unescape(i_data.replace(/'/g, "\"")));
            }
            catch(ex){
                console.log(i_data);
            }
        },

        ApplyTemplate: function (i_instance, i_callback) {

            var templateData = '';
            var crntPlugin = i_instance;

            NE.Net.LoadTxtFile(i_instance.BaseFileName + '.html', function (data) {

                templateData = data;

                var variables = _findTokens('var', templateData);
                for (var i = 0; i < variables.length; i++) {
                    crntPlugin[variables[i].name] = variables[i].data;
                }
                templateData = _removeTokens('var', templateData);

                var functions = _findTokens('function', templateData);
                for (var j = 0; j < functions.length; j++) {
                    var params = _findTokens('param', functions[j].data);
                    templateData = _runFunction(crntPlugin, functions[j].name, params, templateData);
                }

                if (i_callback) i_callback(templateData);

            });

        },

        AttachEvent: function (i_itemID, i_event, i_callback) {
       
            var itemSlot = _itemEvents[i_itemID];

            if (itemSlot === null || itemSlot === undefined) {
                _itemEvents[i_itemID] = {
                    eventList: []
                };
            }

            _itemEvents[i_itemID].eventList.push({
                event: i_event,
                callback: i_callback
            });

        },

        eof: null
    };

})();

