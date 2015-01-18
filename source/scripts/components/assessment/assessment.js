/// <reference path="../../libraries/masala-ux/dist/js/jquery.min.js" />
/// <reference path="../../NE.Plugin.js" />
/// <reference path="../../../../content/structure/courseTree.js" />
/// <reference path="../../NE.Scroll.js" />

// Ensure that the NE namespace is avaiable
if (NE === null || NE === undefined) { var NE = {}; }
if (NE.Plugin === null || NE.Plugin === undefined) { NE.Plugin = {}; }

NE.Plugin.assessment = function(i_params) {

    var _params = i_params;
    var _settings = {};
    var _myDOMContent;
    var _numComponents = 0;
    var _componentsLoaded = 0;
    var _assessmentdata = null;
    var _openFeedback;

    //////////////////////
    //  Initiation 
    /////////////////////

    (function() {



    })();


    function _addToDOM(i_content) {
        _params.node.replaceWith(i_content);
    }

    function _onComplete() {
        _adjustButtons();
        $('#' + _settings.ID).on('click', '.NE-assessment-option-button', function() {
            _onButtonClick($(this));
        });
        me.OnLoaded();
    }

    function _onCompnentsLoad(e) {

        _componentsLoaded++;

        if (_componentsLoaded == _numComponents) {
            me.OnLoaded({
                chapter: _settings.chapterIndex,
                index: _settings.index,
                gui: _settings.guid
            });
        }
    }

    function _onButtonClick(i_sender) {
        _toggleButtons(i_sender);

        console.clear();
        // Try set the  response..
        // TODO Move NE.AssessmentsResult-stuff to another place?
        var resultObj = window['NE.AssessmentsResult'] || [];

        var interactionkey = i_sender.data('interactionkey');


        if (interactionkey) {

            var interactionId = $('#' + interactionkey + '-id').val();
            var description = $('#' + interactionkey + '-description').val();
            var response = i_sender.data('answer') || i_sender.text().trim();
            var result = i_sender.data('result') || 'unanticipated';
            var weighting = parseInt($('#' + interactionkey + '-weighting').val(), 10);

            var interactionData = {
                "id": $('#' + interactionkey + '-id').val(),
                "response": i_sender.data('answer') || i_sender.text().trim(),
                "result": i_sender.data('result') || 'unanticipated',
                "weighting": parseInt($('#' + interactionkey + '-weighting').val(), 10),
                "description": $('#' + interactionkey + '-description').val()
            };

            try {
                NE.LMS.Interactions.StoreInteraction(interactionData);
            } catch (e) { }

            // Look for earlier entry...
            var insertAtIndex = resultObj.length;
            // alert();
            var loopIndex;
            for (loopIndex = 0; loopIndex < resultObj.length; loopIndex++) {
                if (resultObj[loopIndex].id === interactionId) {
                    insertAtIndex = loopIndex;
                    break;
                }
            }
            
            resultObj[insertAtIndex] = interactionData;
            
            window['NE.AssessmentsResult'] = resultObj;
        }

        if (_assessmentdata.instantFeedback === false) {
            _onAfterOption(i_sender);
            return;
        }

        _displayFeedback(i_sender, function() {
            _onAfterOption(i_sender);
        });
    }

    function _onAfterOption(i_sender) {
        if (_assessmentdata.autoSubmit) {
            me.OnSubmit(i_sender);
        }
    }

    function _toggleButtons(i_sender) {
        // alert(_settings.ID); 
        $('.NE-assessment-option-button', '#' + _settings.ID).removeClass('active');
        i_sender.addClass('active');
    }

    function _displayFeedback(i_sender, i_callback) {

        var fbId = i_sender.data('fb');
        var fbArea = $('#' + fbId);

        if (_openFeedback) {
            if (_openFeedback.attr('id') == fbArea.attr('id')) return;
            fbArea.parent().css('height', fbArea.parent().outerHeight() + 'px');
            _openFeedback.fadeOut(300, function() {
                fbArea.removeClass('hidden').fadeOut(0).fadeIn(300, function() {
                    if (i_callback) i_callback();
                });
            });
        }
        else {
            fbArea.removeClass('hidden').slideUp(0).slideDown(300, function() {
                NE.Scroll.ToElementY(fbArea, 'middle', i_callback);
            });
        }

        _openFeedback = fbArea;

    }

    function _padRow(i_row, i_height, i_rowCount) {

        for (var i = 0; i < i_row.length; i++) {

            var item = i_row[i];
            var diff = i_height - item.outerHeight();

            if (diff > 0) {
                diff = 15 + (diff / 2);
                item.css({
                    'padding-top': diff + 'px',
                    'padding-bottom': diff + 'px'
                });
            }

            // if (i_rowCount > 0) item.parent().addClass('mt-xs');

        }
    }

    function _adjustButtons() {

        var cnt = 0;
        var highst = 0;
        var limit = 3;
        var row = [];
        var rowCount = 0;

        $('.NE-assessment-option-button', '#' + _settings.ID).each(function(i) {

            var h = $(this).outerHeight();
            highst = h > highst ? h : highst;

            row.push($(this));

            if (cnt++ == limit - 1) {
                _padRow(row, highst, rowCount);
                rowCount++;
                highst = null;
                cnt = 0;
                row = [];
            }

        });

        _padRow(row, highst, rowCount);

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

        Name: 'assessment',
        Dependencies: [
            'assessment.css'
        ],

        //////////////////////
        //
        //  Public functions 
        //
        /////////////////////

        Init: function() {

            _settings = _params.settings;



            if (_settings.datafile) {

                NE.Net.LoadJsonFile(_settings.datafile, function(jsonData) {

                    _assessmentdata = jsonData;

                    NE.Plugin.ApplyTemplate(me, function(data) {

                        _myDOMContent = $(data.replace(/{assessmentID}/g, _settings.ID));
                        _addToDOM(_myDOMContent);
                        _onComplete();

                    });

                });
            }
            else {
                _onComplete();
            }



        },

        Render: function(params) {

            var assessmentId = _assessmentdata.id,
                questionIndex,
                currentQuestion,
                optionIndex,
                currentOption,
                feedbackIndex,
                currentFeedback;

            var returnVal = '';

            if (_assessmentdata.title !== '' || _assessmentdata.introContent !== '') {
                returnVal += params[0].data.replace(/{title}/g, _assessmentdata.title).replace(/{introContent}/g, _assessmentdata.introContent);
            }

            for (questionIndex = 0; questionIndex < _assessmentdata.questions.length; questionIndex++) {
                currentQuestion = _assessmentdata.questions[questionIndex];

                if (currentQuestion.title !== '' || currentQuestion.introContent !== '') {
                    returnVal += params[1].data.replace(/{title}/g, currentQuestion.title).replace(/{introContent}/g, currentQuestion.introContent);
                }

                returnVal += params[2].data;

                for (optionIndex = 0; optionIndex < currentQuestion.options.length; optionIndex++) {
                    currentOption = currentQuestion.options[optionIndex];
                    var optData = params[3].data;
                    var classes = '';
                    if (currentQuestion.questionType == 'singleChoice') {
                        classes += ' toggle';
                    }
                    optData = optData.replace(/{content}/g, currentOption.content);
                    optData = optData.replace(/{answerData}/g, currentOption.answerData);
                    // optData = optData.replace(/{assessmentId}/g, assessmentId);
                    // optData = optData.replace(/{questionIndex}/g, questionIndex);
                    optData = optData.replace(/{feedbackIndex}/g, currentOption.feedbackIndex);
                    optData = optData.replace(/{reportingResult}/g, currentOption.reports);
                    optData = optData.replace(/{optionButtonClasses}/g, classes);

                    returnVal += optData;
                }

                for (feedbackIndex = 0; feedbackIndex < currentQuestion.feedback.length; feedbackIndex++) {
                    currentFeedback = currentQuestion.feedback[feedbackIndex];
                    var fbData = params[4].data;
                    fbData = fbData.replace(/{content}/g, currentFeedback.content);
                    fbData = fbData.replace(/{mood}/g, currentFeedback.mood);
                    // fbData = fbData.replace(/{assessmentId}/g, assessmentId);
                    // fbData = fbData.replace(/{questionIndex}/g, questionIndex);
                    fbData = fbData.replace(/{feedbackIndex}/g, feedbackIndex);
                    returnVal += fbData;
                }

                returnVal = returnVal.replace(/{reportingWeighting}/g, _assessmentdata.reporting.weighting);
                returnVal = returnVal.replace(/{reportingId}/g, _assessmentdata.reporting.id);
                returnVal = returnVal.replace(/{reportingDescription}/g, _assessmentdata.reporting.description);
                returnVal = returnVal.replace(/{questionIndex}/g, questionIndex);

                returnVal += params[5].data;
            }

            returnVal = returnVal.replace(/{assessmentId}/g, assessmentId);

            return returnVal;
        },


        OnLoaded: function(e) { },
        OnSubmit: function(e) { },

        eof: null
    };

    return me;

};

