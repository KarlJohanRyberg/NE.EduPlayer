﻿/// <reference path="../../libraries/masala-ux/dist/js/jquery.min.js" />
/// <reference path="../../NE.Plugin.js" />
/// <reference path="../../../../content/structure/courseTree.js" />
/// <reference path="../../NE.Events.js" />

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

NE.Plugin.verticalnav = function (i_params) {

    //////////////////////
    //
    //  Private fields 
    //
    /////////////////////

    var _params = i_params;
    var _settings = {};
    var _myDOMContent;

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

    function _eqHeightCols() {
        var panelSelector = '#' + _settings.ID;
        var tallest = 0;
        var hiddenElements = [];

        $('.NE-eq-height-padder', panelSelector).css('height', '');

        var pageHolder = $('.NE-vert-page-holder', '#' + _settings.ID).first();
        var containerHeight = pageHolder.outerHeight();
        containerHeight = containerHeight > 0 ? containerHeight : pageHolder.data('orgHeight');

        $('.NE-eq-height', panelSelector).each(function () {
            var myHeight = $(this).outerHeight();
            myHeight = myHeight > 0 ? myHeight : $(this).data('orgHeight');

            var padding = containerHeight - myHeight;
            var padder = $(this).find('.NE-eq-height-padder');

            if (padder.length) {
                padder.css('height', padding + 'px');
            }
            else {
                $(this).css('height', myHeight + 'px');
            }
        });


    }

    function _afterLoad() {

        me.VisibleSlides = me.PanelSettings.pages.length;

        $('.NE-vert-page-prev', '#' + _settings.ID).on('click', function (evt) {
            NE.Plugin.verticalnav.EventHandlers.NavPrev(me);
            me.OnChanged(me);
        });

        $('.NE-vert-page-next', '#' + _settings.ID).on('click', function (evt) {
            NE.Plugin.verticalnav.EventHandlers.NavNext(me);
            me.OnChanged(me);
        });

        $(window).on('resize', function () {
            _eqHeightCols();
        });

        if (_settings.hidenavigation) {
            var panel = $('#' + _settings.ID);
            panel.find('.NE-vert-page-navbar').hide();
        }

        NE.Events.Add(NE.UI.ON_PAGE_REVEAL, function (e) {
            if (e.ID == $('#' + _settings.ID).parents('.NE-page').first().attr('id')) {
                _eqHeightCols();
            }
        });

        var pageHolder = $('.NE-vert-page-holder', '#' + _settings.ID).first();
        pageHolder.data('orgHeight', pageHolder.outerHeight());
        $('.NE-eq-height', '#' + _settings.ID).each(function () {
            $(this).data('orgHeight', $(this).outerHeight());
        });

        me.Filter();
        NE.Plugin.verticalnav.EventHandlers.NavTo(me);
        me.OnLoaded();
    }

    function _addToDOM(i_content) {
        _params.node.replaceWith(i_content);
        var panel = $('#' + _settings.ID).find('.NE-vert-page-holder').first();
        panel.css('width', (_settings.pages.length * 100) + '%');
        panel.find('.NE-vert-page').css('width', (100 / _settings.pages.length) + '%');
    }

    function _pageOnLoad(e) {

        if (e.chapter == _settings.ID) {
            me.LoadedPages++;
            if (me.LoadedPages == _settings.pages.length) {
                _afterLoad();
            }

        }
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

        Name: 'verticalnav',
        LoadedPages: 0,
        Dependencies: [
            'verticalnav.css',
            'verticalnav.EventHandlers.js'
        ],

        //////////////////////
        //
        //  Public functions 
        //
        /////////////////////

        CurrentSlide: 0,
        VisibleSlides: [],
        CurrentPanel: null,

        PanelSettings: null,

        Init: function () {

            _settings = _params.settings;
            me.PanelSettings = _settings;

            NE.Plugin.ApplyTemplate(this, function (data) {

                _myDOMContent = $(data.replace(/{ID}/g, _settings.ID));
                _addToDOM(_myDOMContent);

                NE.Plugin.LoadAll(_myDOMContent.first(), _pageOnLoad);

            });

        },

        AddPages: function (params) {

            var returnVal = '';
            var groupIndencies = {};

            for (var i = 0; i < _settings.pages.length; i++) {
                var data = params[0].data;
                data = data.replace(/{pageID}/g, NE.Constants.PAGE_ID_PREFIX + _settings.ID + '-' + i);
                data = data.replace(/{ID}/g, _settings.ID);
                data = data.replace(/{index}/g, i);
                data = data.replace(/{datafile}/g, _settings.pages[i].datafile);

                var groupNum = _settings.pages[i].group;
                data = data.replace(/{group}/g, groupNum);

                if (groupIndencies[groupNum] === undefined) groupIndencies[groupNum] = 0;

                data = data.replace(/{groupIndex}/g, groupIndencies[groupNum]++);

                returnVal += data;
            }

            return returnVal;

        },

        AddIcons: function (params) {
            var returnVal = '';

            for (var i = 0; i < _settings.pages.length; i++) {
                returnVal += params[0].data;
            }

            return returnVal;
        },

        AdjustHeight: function () {
            var currentSlideDiv = $('#' + me.PanelSettings.ID + '-' + me.CurrentSlide);
            var pageHolder = $('.NE-vert-page-holder', '#' + _settings.ID).first();
            pageHolder.height(currentSlideDiv.outerHeight());
        },

        Filter: function (i_groupIndex, i_index) {
            me.VisibleSlides = [];

            var visiblePages;
            var allPages = $('.NE-vert-page', '#' + _settings.ID);
            allPages.find('.NE-eq-height').removeClass('filter-visible');

            if (i_groupIndex !== undefined && i_index !== undefined) {
                allPages.hide();
                visiblePages = $('.vert-page-group-' + i_groupIndex + '[data-groupindex="' + i_index + '"]', '#' + _settings.ID);
            }
            else if (i_groupIndex !== undefined) {
                allPages.hide();
                visiblePages = $('.vert-page-group-' + i_groupIndex, '#' + _settings.ID);
            }
            else {
                allPages.show();
                visiblePages = allPages;
            }
    
            visiblePages.each(function () {
                $(this).find('.NE-eq-height').addClass('filter-visible');
                me.VisibleSlides.push($(this));
            }).show();

            me.CurrentSlide = 0;

            $('.icon', '#' + _settings.ID).each(function (i) {
                if (i < visiblePages.length) {
                    $(this).show();
                }
                else {
                    $(this).hide();
                }
            });

            NE.Plugin.verticalnav.EventHandlers.NavTo(me);

            _eqHeightCols();
        },

        OnLoaded: function (e) { },
        OnChanged: function (e) { },

        eof: null
    };

    return me;

};

