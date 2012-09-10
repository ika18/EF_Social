define(['compose',
    'jquery',
    'troopjs-core/component/widget',
    'troopjs-utils/deferred',
    'template!./main.html',
    'jquery.etsCheckbox'], function shareAndDescribe(Compose, $, Widget, Deferred, template) {
    "use strict";

    var mockData = {
        content: {
            imageLib: [
                {url: 'mock/image/defaultOptions/chinese_s.jpg'},
                {url: 'mock/image/defaultOptions/hamburger_s.jpg'},
                {url: 'mock/image/defaultOptions/frenchfries_s.jpg'},
                {url: 'mock/image/defaultOptions/pasta_s.jpg'},
                {url: 'mock/image/defaultOptions/pizza_s.jpg'},
                {url: 'mock/image/defaultOptions/sallad_s.jpg'},
                {url: 'mock/image/defaultOptions/salmon_s.jpg'},
                {url: 'mock/image/defaultOptions/seafood_s.jpg'},
                {url: 'mock/image/defaultOptions/sushi_s.jpg'},
                {url: 'mock/image/defaultOptions/toast_s.jpg'}
            ]
        }
        
    };


    // fitler origin _json data to meet activity requirements
    function filterData() {

    }

    // render template and insert it into html
    function render(deferred) {
        var me = this;
        var $root = this.$element;

        Deferred(function (renderDfd) {
            me.html(template, me._json, renderDfd);
        }).done(function () {
            onRendered.call(me);
        }).done(function () {
            me.$placehodler = $root.find('.ets-placeholder');
            deferred.resolve();
        });
    }

    // on template rendered
    // initialize some stuffs
    function onRendered() {
        var me = this;
        var $root = this.$element;

        $root.find('[data-toggle="ets-checkbox"]').etsCheckbox();
    }

    return Widget.extend(function () {
        this._json = mockData;


    }, {
        'sig/initialize': function onStart(signal, deferred) {
            var me = this;

            Deferred(function (dfd) {
                filterData();
                dfd.resolve();
            }).done(function () {
                render.call(me, deferred);
            });
        },

        // dom interaction
        'dom/action.click.focusin.focusout.mouseout.mouseover': $.noop,
        'dom/action/describe.focusin': function (topic, $e, index) {
            var me = this;
            var $target = $($e.target);

            me.$placehodler.addClass('ets-none');
        },
        'dom/action/describe.focusout': function (topic, $e, index) {
            var me = this;
            var $target = $($e.target);

            if (!$.trim($target.val()).length) {
                me.$placehodler.removeClass('ets-none');
            }
        },
        'dom/action/agree.mouseover': function (topic, $e, index) {
            var me = this;
            var $target = $($e.target);

            $target.parent().addClass('share-info-hover');
        },
        'dom/action/agree.mouseout': function (topic, $e, index) {
            var me = this;
            var $target = $($e.target);

            $target.parent().removeClass('share-info-hover');
        }

    })
});