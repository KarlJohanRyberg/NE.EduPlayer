if(null===NE||void 0===NE)var NE={};if((null===NE.Plugin||void 0===NE.Plugin)&&(NE.Plugin={}),NE.Plugin.topmenu=function(i_params){function _addToDOM(i_content){_params.node.replaceWith(i_content)}var _params=i_params;return{Name:"topmenu",Dependencies:["topmenu.css","topmenu.EventHandlers.js"],Init:function(){NE.Plugin.ApplyTemplate(this,function(data){_myDOMContent=$(data),_addToDOM(_myDOMContent),NE.Plugin.LoadAll(_myDOMContent,function(){$(window).on("resize",function(){NE.Plugin.topmenu.EventHandlers.WindowResize()}),$(".NE-chapter-label").on("click",function(){NE.Plugin.topmenu.EventHandlers.ChapterLabelClick($(this))}),$("#"+_myDOMContent.first().attr("id")).on("click",".NE-chapterlink",function(){NE.Plugin.topmenu.EventHandlers.ChapterLinkClick($(this))}),$("#NE-top-backdrop").on("click",function(){NE.Plugin.topmenu.EventHandlers.OverlayClick($(this))}),NE.Events.Add(NE.Navigation.ON_NAVIGATION,NE.Plugin.topmenu.EventHandlers.UpdateChapterMenu)})})},SetTitle:function(params){return params[0].data.replace(/{courseTitle}/g,NE.CourseTree.name)},MenuXs:function(params){var returnData="";for(var uid in NE.CourseTree.chapters){var chapter=NE.CourseTree.chapters[uid];chapter.properties.displayInMenu!==!1&&(returnData+=params[0].data.replace(/{cahpterIndex}/g,chapter.index).replace(/{chapterTitle}/g,chapter.title))}return returnData},HeaderMenu:function(params){var returnData=params[0].data;for(var uid in NE.CourseTree.chapters){var chapter=NE.CourseTree.chapters[uid];chapter.properties.displayInMenu!==!1&&(returnData+=params[1].data.replace(/{cahpterIndex}/g,chapter.index).replace(/{chapterTitle}/g,chapter.title))}return returnData+=params[2].data},eof:null}},null===NE||void 0===NE)var NE={};(null===NE.Plugin||void 0===NE.Plugin)&&(NE.Plugin={}),(null===NE.Plugin.topmenu||void 0===NE.Plugin.topmenu)&&(NE.Plugin.topmenu={}),NE.Plugin.topmenu.EventHandlers=function(){function _openChapterPanel(i_item){var chapterMenuDiv=$("#NE-top-chapter-navigation"),menuHeight=0;chapterMenuDiv.find(".NE-chapterlink-collection").each(function(){var itemHeight=$(this).outerHeight();$("#isXS").is(":visible")?menuHeight+=itemHeight:menuHeight=itemHeight>menuHeight?itemHeight:menuHeight}),$("#NE-top-backdrop").fadeTo(0,0).fadeTo(300,.65),NE.UI.DisableContentScroll(),i_item.parent().addClass("active");var max=parseInt(chapterMenuDiv.css("max-height")),isScroll="hidden";menuHeight>max&&(menuHeight=max,isScroll="auto"),chapterMenuDiv.css({"border-top-width":"1px",height:menuHeight+"px",overflow:isScroll}).toggleClass("open"),NE.UI.ToggleBackNavButtons(!1),NE.UI.ToggleForwardNavButtons(!1)}function _closeChapterPanel(i_item){$("#NE-top-backdrop").fadeTo(300,0,function(){$(this).hide(),i_item.parent().removeClass("active"),NE.UI.EnableContentScroll()});var chapterMenuDiv=$("#NE-top-chapter-navigation");chapterMenuDiv.css({"border-top-width":"0px",height:"0px"}).toggleClass("open"),NE.UI.ToggleBackNavButtons(!0),NE.UI.ToggleForwardNavButtons(!0)}var _clickTimer;return{WindowResize:function(){$("#NE-top-chapter-navigation").hasClass("open")&&$(".NE-chapter-label").click()},ChapterLabelClick:function(i_item){if(i_item.is(":visible")){var now=new Date,delay=_clickTimer?now-_clickTimer:1e3;if(_clickTimer=now,!(500>delay)){var chapterMenuDiv=$("#NE-top-chapter-navigation");chapterMenuDiv.hasClass("open")?_closeChapterPanel(i_item):_openChapterPanel(i_item),i_item.blur()}}},ChapterLinkClick:function(i_item){if(!i_item.hasClass("disable")&&!i_item.hasClass("current")){{var chapterIndex=parseInt(i_item.data("chapter"),10);$("#"+NE.Constants.CHAPTER_ID_PREFIX+chapterIndex)}NE.UI.EnableContentScroll();for(var i=NE.Navigation.CurrentChapterIndex;chapterIndex>i;i++)NE.UI.Unlock(i);NE.UI.Unlock(chapterIndex,0),NE.Navigation.ToChapter(chapterIndex),NE.UI.ScrollToPage(),$(".NE-chapter-label").click()}},OverlayClick:function(){$(".NE-chapter-label").click()},UpdateChapterMenu:function(){var menuIitem=$(".NE-chapterlink-"+NE.Navigation.CurrentChapterIndex).first();menuIitem.length&&$("#NE-chapter-label-big").html(menuIitem.find(".link-label").first().html()+NE.Constants.HEADER_CHAPTER_NAV_ICON)},eof:null}}();