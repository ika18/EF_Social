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
    var $root=this.$element;

    $root.find(route).removeClass("ets-none")
         .siblings().addClass("ets-none");
    switch(route){
      case ".share-and-describe-screen":
        me.publish("st/share-and-describe/reload", data);
      break;
      case ".picture-wall-screen":
        me.publish("st/picture-wall/reload", data);
      break;

    };
  };

  return Widget.extend({
    "sig/start": function(signal, deferred) {
      var me=this;
      me.html(template);

      //load screen via environment params
      var isNewUser=true;
      var data={};
       me.publish("choose-picture-screen/show", data);

      if(isNewUser) {
        me.publish("choose-picture-screen/show", data);
      }
      else {
        me.publish("picture-wall-screen/show",data);
      }

      if(deferred) {
        deferred.resolve();
      }
    },

    //activate picture screen 
    "hub/choose-picture-screen/show": function(topic, data) {
        var me = this;
        console.log("choose-picture-screen/show");
        lightenScreen.call(me, ".choose-picture-screen", data);
    },

    //activate share and describe screen 
    "hub/share-and-describe-screen/show":function(topic, data){
        var me=this;
        lightenScreen.call(me, ".share-and-describe-screen", data);
    },

    //activate picture wall screen 
    "hub/picture-wall-screen/show":function(topic, data){
        var me=this;
        console.log(data);
        lightenScreen.call(me, ".picture-wall-screen", data);
    },

    // dom interaction
    'dom/action.input.click.focusin.focusout.mouseout.mouseover': $.noop,

  });

});