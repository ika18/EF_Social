define(['jquery',
    'troopjs-core/component/widget',
    'template!./item.html',
    'troopjs-utils/deferred'], function ($, Widget, template, Deferred) {
    "use strict";

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

    return Widget.extend({
        'sig/initialize': function (signal, deferred) {
            var me = this;
            // console.log('initialize')
            // render.call(me);
            $.get('mock/data/profile-item.json').done(function (res) {
                me._json = res;
                deferred.resolve();
            }).fail(function () {
                throw "Load template error";
            });
            
        },
        'sig/start': function (signal, deferred) {
            var me = this;

            render.call(me, deferred);
        },
        // dom action
        'dom/action.click': $.noop,
        'dom/action/profile/item.click': function (topic, $e) {
            var me = this;
            var $target = $($e.target);

            $target.closest('li').siblings().removeClass('ets-on').end()
            .toggleClass('ets-on');

            $e.preventDefault();
        }
    });
});