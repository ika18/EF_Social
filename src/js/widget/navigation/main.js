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
            .attr("data-action", "navigation/nextStep.click");
    }

    function statusDisabled()
    {
        var me = this;
        $("#next-step")
            .addClass("ets-disabled")
            .removeAttr("data-action");
    }

    return Widget.extend({
        "sig/start": function(signal, deferred) {
            var me = this;
            render.call(me, deferred);
        },

        "hub/navigation/nextStep/enabled": function(topic, delegate) {
            var me = this;
            statusEnabled.call(me, delegate);
        },

        "hub/navigation/nextStep/disabled": function(topic) {
            var me = this;
            statusDisabled.call(me);
        },

        "hub/navigation/nextActivity": function(topic) {
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