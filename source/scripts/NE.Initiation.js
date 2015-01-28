/// <reference path="NE.Net.js" />
/// <reference path="NE.Plugin.js" />
/// <reference path="../libraries/masala-ux/dist/js/jquery.min.js" />
/// <reference path="NE.Navigation.js" />
/// <reference path="NE.Events.js" />
/// <reference path="NE.EventHandlers.js" />
/// <reference path="NE.Constants.js" />
/// <reference path="NE.UI.js" />
/// <reference path="../../content/structure/courseTree.js" />
if (typeof DEBUG === 'undefined') DEBUG = true;


$(window).load(function () {

    console.info('Turning off mock SCORM API logging');
    NE.API_1484_11.PreventLog = true;


    if (libCount > 0) {
        for (var i = 0; i < libCount; i++) {
            NE.Net.AddScriptFile(NE.Constants.APPLICATION_BASE_PATH + '/scripts/libraries/' + NE.Constants.LIBRARIES[i], allLibsLoaded);
        }
    }
    else {
        attachEvents();
    }

});


var libCount = NE.Constants.LIBRARIES.length;
var libsloaded = 0;

function allLibsLoaded() {
    libsloaded++;
    if (libsloaded == libCount) {
        attachEvents();
    }
}


function attachEvents() {

    NE.Net.AddScriptFile(NE.Constants.CONTENT_BASE_PATH + '/content/structure/courseTree.js', NE.EventHandlers.StructureLoaded);

    $(window).on('resize', function (e) {
        NE.EventHandlers.WindowResize(e);
    });

    $(document).on('beforeunload unload', function() {
        NE.LMS.Exit();
    });
    $(window).on('beforeunload unload', function() {
        NE.LMS.Exit();
    });

    FastClick.attach(document.body);


    NE.Events.Add(NE.Navigation.ON_NAVIGATION, NE.EventHandlers.Navigation);

    $('body').on('click', '.NE-nav-back', function () {
        if ($(this).hasClass('disable')) return;
        NE.EventHandlers.NavBackBtnClick($(this));
    });

    $('body').on('click', '.NE-nav-forward', function () {
        if ($(this).hasClass('disable')) return;
        NE.EventHandlers.NavForwardBtnClick($(this));
    });

    $('#NE-chapter-label').on('click', function () {
        NE.EventHandlers.ChapterLabelClick($(this));
    });

    $('#NE-scroller').on('click', '.NE-chapterlink', function (e) {
        NE.EventHandlers.ChapterLinkCLick($(this), e);
    });


    $(document).on('keyup', NE.EventHandlers.KeyUp);

}
