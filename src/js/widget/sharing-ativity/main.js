define([  
    "jquery",
    'troopjs-core/component/widget',
    'template!./main.html',
    'troopjs-utils/deferred'
], function DemoModule($, Widget, template, Deferred) {
  "use strict";

  var lightenScreen=function(route, data)
  {
    var me=this;
    //if widget not exist then weave
    me.$element.find('.active-container')
      .unweave()
      .data("d",data)
      .attr("data-weave",route)
      .weave();
  };

  return Widget.extend({
    "sig/start": function(signal, deferred) {
      var me=this;
      me.html(template);

      //load screen via environment params
      var isNewUser=true;
      var data = { msg: "hello i'm in DemoModule!"};

      if(isNewUser) {
        me.publish("choose-picture-screen/show", data);
      }
      else {
        me.publish("share-and-describe-screen/show",data);
      }

      if(deferred) {
        deferred.resolve();
      }
    },

    //activate picture screen 
    "hub/choose-picture-screen/show": function(topic, data) {
        var me = this;
        lightenScreen.call(me, "widget/choose-picture/main", data);
    },

    //activate share and describe screen 
    "hub/share-and-describe-screen/show":function(topic, data){
        var me=this;
        lightenScreen.call(me, "widget/share-and-describe/main", data);

    },

    //activate picture wall screen 
    "hub/picture-wall-screen/show":function(topic, data){
        var me=this;
        lightenScreen.call(me, "widget/picture-wall/main", data);
    },

    // dom interaction
    'dom/action.input.click.focusin.focusout.mouseout.mouseover': $.noop,

  });

});