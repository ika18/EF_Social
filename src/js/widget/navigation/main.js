define([
    "jquery",
    'troopjs-core/component/widget',
    'template!./navigation.html',
    'troopjs-utils/deferred'
], function DemoModule($, Widget, template, Deferred) {
    "use strict";
    
    var $ELEMENT = "$element";
    var DELEGATE = "DELEGATE";

        // render template
    function render(deferred) {
        var me = this;

        me.html(template, me._json,deferred);
    }


    function statusEnabled(delegate)
    {
        var me = this;
        me[$ELEMENT]
            .data(DELEGATE, delegate)
            .find("#next-step")
            .removeClass("ets-disabled")
            .addClass("ets-enabled")
            .attr("data-action", "navigation/nextStep.click");
    }

    function statusDisabled()
    {
        var me = this;
        me[$ELEMENT]
            .find("#next-step")
            .removeClass("ets-enabled")
            .addClass("ets-disabled")
            .removeAttr("navigation/nextStep.click");
    }




    return Widget.extend({
        "sig/start": function(signal, deferred) {
            var me = this;
            render.call(me, deferred);
        },

        "hub/st/navigation/nextStep/enabled": function(topic, delegate) {
            var me = this;
            statusEnabled.call(me, delegate);
        },

        "hub/st/navigation/nextStep/disabled": function(topic) {
            var me = this;
            statusDisabled.call(me);
        },

        "hub/st/navigation/nextActivity": function(topic) {
            var me = this;
            statusEnabled.call(me, function() {
                alert("Active completed !!!");
                //go to next active;
            });
        },

        "dom/action.click": $.noop,

        "dom/action/navigation/nextStep.click":function(topic, $e){
            var me = this;
            var delegate=  me[$ELEMENT].data(DELEGATE);
             
            if(delegate && typeof delegate==="function")
            {
                delegate();
            }
            //console.log("nextStep clicked");

        }
    });
});