define([
    "jquery",
    'troopjs-core/component/widget',
    'template!./next-step.html',
    'troopjs-utils/deferred'
], function DemoModule($, Widget, template, Deferred) {
    "use strict";
    
    var $ELEMENT = "$element";

        // render template
    function render(deferred) {
        var me = this;

        Deferred(function (dfd) {
            me.html(template, me._json);
            dfd.resolve();
        }).done(function () {
            deferred.resolve();
        });
    }


    function statusEnabled(delegate, deferred)
    {
        var me = this;
        me[$ELEMENT]
            .data("DELEGATE",delegate)
            .find("#next-step")
            .removeClass("ets-disabled")
            .addClass("ets-enabled")
            .attr("data-action","navigation.click");

        if(deferred)
        {
            deferred.resolve();
        }
    }

    function statusDisabled(deferred)
    {
        var me = this;
        me[$ELEMENT]
            .find("#next-step")
            .removeClass("ets-enabled")
            .addClass("ets-disabled")
            .removeAttr("navigation.click");

        if(deferred)
        {
            deferred.resolve();
        }
    }




    return Widget.extend(function($element, displayName, type) {
        //var me = this;
        //console.log("type="+type);
    },{
        "sig/start": function(signal, deferred) {
            var me = this;
            render.call(me, deferred);
        },

        "hub/st/navigation/enabled": function(topic, delegate, deferred) {
            var me = this;
            statusEnabled.call(me, delegate, deferred);
        },

        "hub/st/navigation/disabled": function(topic, deferred) {
            var me = this;
            statusDisabled.call(me, deferred);
        },

        "hub/st/navigation/nextActivity": function(topic, deferred) {
            var me = this;
            statusEnabled.call(me, function() {

                alert("Active completed !!!");
                //go to next active;

            }, deferred);

        },

        "dom/action.click": $.noop,

        "dom/action/navigation.click":function(topic, $event,deferred){
            var me = this;
            var delegate=  me[$ELEMENT].data("DELEGATE");
             
            if(delegate && typeof delegate==="function")
            {
                delegate();
               
                if(deferred)
                {
                    deferred.resolve();
                }

            }

            //console.log("nextStep clicked");

        }
    });
});