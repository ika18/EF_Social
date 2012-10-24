define([
    "jquery",
    'troopjs-core/component/widget',
    'template!./main.html',
    'troopjs-utils/deferred'
], function DemoModule($, Widget, template, Deferred) {

    function render(deferred) {
        var me = this;
        me.html(template, {}, deferred);
    }

    return Widget.extend({
        'sig/initialize': function (signal, deferred) {
            render.call(this, deferred);
        },

        'dom/action.click': $.noop,
        'dom/action/complete/close.click': function (topic, $e) {
            var me = this;

            me.$element.fadeOut('fast', function () {
                me.unweave();
            });
        }
    });
});