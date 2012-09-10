define(['compose',
    'troopjs-core/component/widget',
    'troopjs-utils/deferred',
    'template!./main.html'], function shareAndDescribe(Compose, Widget, Deferred, template) {
    "use strict";

    // fitler origin _json data to meet activity requirements
    function filterData() {

    }

    function render(deferred) {
        var me = this;
        Deferred(function (renderDfd) {
            me.html(template, me._json, renderDfd);
        }).done(function () {
            deferred.resolve();
        });
    }

    return Widget.extend(function () {
        this._json = {};
    }, {
        'sig/initialize': function onStart(signal, deferred) {
            var me = this;

            Deferred(function (dfd) {
                filterData();
                dfd.resolve();
            }).done(function () {
                render.call(me, deferred);
            });
        }
    })
});