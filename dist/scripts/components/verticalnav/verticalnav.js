if(null===NE||void 0===NE)var NE={};if((null===NE.Plugin||void 0===NE.Plugin)&&(NE.Plugin={}),NE.Plugin.verticalnav=function(i_params){function _eqHeightCols(){var panelSelector="#"+_settings.ID,tallest=0,hiddenElements=[];$(".NE-eq-height",panelSelector).css("height",""),$(".NE-eq-height").each(function(){$(this).find(".pusher").length||$(this).prepend($("<div/>").addClass("pusher")),$(this).parents().each(function(){$(this).hasClass("hidden")?(hiddenElements.push([$(this),"hidden"]),$(this).removeClass("hidden")):$(this).hasClass("NE-nav-hidden")&&(hiddenElements.push([$(this),"NE-nav-hidden"]),$(this).removeClass("NE-nav-hidden"))})}),$(".NE-eq-height",panelSelector).each(function(){var orgHeight=$(this).outerHeight();orgHeight=0===orgHeight?$(this).data("orgHeight"):orgHeight,$(this).data("orgHeight",orgHeight),orgHeight>tallest&&$(this).hasClass("filter-visible")&&(tallest=orgHeight)});for(var i=0;i<hiddenElements.length;i++)hiddenElements[i][0].addClass(hiddenElements[i][1]);tallest>0&&$(".NE-eq-height",panelSelector).each(function(){var padding=tallest-$(this).data("orgHeight");$(this).find(".NE-eq-height-padder").first().css("height",padding+"px")})}function _afterLoad(){if(me.VisibleSlides=me.PanelSettings.pages.length,$(".NE-vert-page-prev","#"+_settings.ID).on("click",function(){NE.Plugin.verticalnav.EventHandlers.NavPrev(me),me.OnChanged(me)}),$(".NE-vert-page-next","#"+_settings.ID).on("click",function(){NE.Plugin.verticalnav.EventHandlers.NavNext(me),me.OnChanged(me)}),_settings.hidenavigation){var panel=$("#"+_settings.ID);panel.css("padding-bottom","0px"),panel.find(".NE-vert-page-nav, .NE-vert-page-icons").hide()}$(".NE-eq-height",$("#"+_settings.ID)).each(function(){$(this).data("orgHeight",$(this).outerHeight())}),me.Filter(),NE.Plugin.verticalnav.EventHandlers.NavTo(me),me.OnLoaded()}function _addToDOM(i_content){_params.node.replaceWith(i_content);var panel=$("#"+_settings.ID).find(".NE-vert-page-holder").first();panel.css("width",100*_settings.pages.length+"%"),panel.find(".NE-vert-page").css("width",100/_settings.pages.length+"%")}function _pageOnLoad(e){e.chapter==_settings.ID&&(me.LoadedPages++,me.LoadedPages==_settings.pages.length&&_afterLoad())}var _myDOMContent,_params=i_params,_settings={},me={Name:"verticalnav",LoadedPages:0,Dependencies:["verticalnav.css","verticalnav.EventHandlers.js"],CurrentSlide:0,VisibleSlides:[],CurrentPanel:null,PanelSettings:null,Init:function(){_settings=_params.settings,me.PanelSettings=_settings,NE.Plugin.ApplyTemplate(this,function(data){_myDOMContent=$(data.replace(/{ID}/g,_settings.ID)),_addToDOM(_myDOMContent),NE.Plugin.LoadAll(_myDOMContent.first(),_pageOnLoad)})},AddPages:function(params){for(var returnVal="",groupIndencies={},i=0;i<_settings.pages.length;i++){var data=params[0].data;data=data.replace(/{ID}/g,_settings.ID),data=data.replace(/{index}/g,i),data=data.replace(/{datafile}/g,_settings.pages[i].datafile);var groupNum=_settings.pages[i].group;data=data.replace(/{group}/g,groupNum),void 0===groupIndencies[groupNum]&&(groupIndencies[groupNum]=0),data=data.replace(/{groupIndex}/g,groupIndencies[groupNum]++),returnVal+=data}return returnVal},AddIcons:function(params){for(var returnVal="",i=0;i<_settings.pages.length;i++)returnVal+=params[0].data;return returnVal},Filter:function(i_groupIndex,i_index){me.VisibleSlides=[];var visiblePages,allPages=$(".NE-vert-page","#"+_settings.ID);allPages.find(".NE-eq-height").removeClass("filter-visible"),void 0!==i_groupIndex&&void 0!==i_index?(allPages.hide(),visiblePages=$(".vert-page-group-"+i_groupIndex+'[data-groupindex="'+i_index+'"]',"#"+_settings.ID)):void 0!==i_groupIndex?(allPages.hide(),visiblePages=$(".vert-page-group-"+i_groupIndex,"#"+_settings.ID)):(allPages.show(),visiblePages=allPages),visiblePages.each(function(){$(this).find(".NE-eq-height").addClass("filter-visible"),me.VisibleSlides.push($(this))}).show(),me.CurrentSlide=0,$(".icon","#"+_settings.ID).each(function(i){i<visiblePages.length?$(this).show():$(this).hide()}),NE.Plugin.verticalnav.EventHandlers.NavTo(me),_eqHeightCols()},OnLoaded:function(){},OnChanged:function(){},eof:null};return me},null===NE||void 0===NE)var NE={};(null===NE.Plugin||void 0===NE.Plugin)&&(NE.Plugin={}),(null===NE.Plugin.verticalnav||void 0===NE.Plugin.verticalnav)&&(NE.Plugin.verticalnav={}),NE.Plugin.verticalnav.EventHandlers=function(){function _bounce(value,instance){var panel=$("#"+instance.PanelSettings.ID).find(".NE-vert-page-holder").first(),scrollPos=100*-instance.CurrentSlide;panel.stop().animate({"margin-left":scrollPos+value+"%"},200,function(){panel.animate({"margin-left":scrollPos+"%"},100)})}function _markIcon(instance){var panel=$("#"+instance.PanelSettings.ID).find(".NE-vert-page-icons").first(),icons=panel.find(".icon");icons.removeClass("active"),icons.eq(instance.CurrentSlide).addClass("active")}return{NavPrev:function(instance){instance.CurrentSlide>0?(instance.CurrentSlide--,this.NavTo(instance)):_bounce(10,instance)},NavNext:function(instance){instance.CurrentSlide<instance.VisibleSlides.length-1?(instance.CurrentSlide++,this.NavTo(instance)):_bounce(-10,instance)},NavTo:function(instance){{var panel=$("#"+instance.PanelSettings.ID).find(".NE-vert-page-holder").first();$("#"+instance.PanelSettings.ID+"-"+instance.CurrentSlide)}panel.stop().animate({"margin-left":100*-instance.CurrentSlide+"%"},300),_markIcon(instance)},eof:null}}();