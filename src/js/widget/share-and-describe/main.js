define(['compose',
    'jquery',
    'troopjs-core/component/widget',
    'troopjs-utils/deferred',
    'template!./main.html',
    'jquery.etsCheckbox',
    'jquery.counter'], function shareAndDescribe(Compose, $, Widget, Deferred, template) {
    "use strict";

    var mockData = {
        content: {
            imageLib: [
                {url: 'mock/image/defaultOptions/chinese.jpg'},
                {url: 'mock/image/defaultOptions/hamburger.jpg'},
                {url: 'mock/image/defaultOptions/frenchfries.jpg'},
                {url: 'mock/image/defaultOptions/pasta.jpg'},
                {url: 'mock/image/defaultOptions/pizza.jpg'},
                {url: 'mock/image/defaultOptions/sallad.jpg'},
                {url: 'mock/image/defaultOptions/salmon.jpg'},
                {url: 'mock/image/defaultOptions/seafood.jpg'},
                {url: 'mock/image/defaultOptions/sushi.jpg'},
                {url: 'mock/image/defaultOptions/toast.jpg'}
            ]
        }
        
    };

    function togglePlaceholder($e) {
        var me = this;

        if ($e.namespace === 'focusin') {
            me.$placeholder.addClass('ets-none');
        } else if ($e.namespace === 'focusout') {
            if (!$.trim(me.$textarea.val()).length) {
                me.$placeholder.removeClass('ets-none');
            }
        }
    }

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
            me.$placeholder = $root.find('.ets-placeholder');
            me.$textarea = $('#input-describe');

            deferred.resolve();
        });
    }

    // on template rendered
    // initialize some stuffs
    /*
    #enchance the checkbox
    #use jquery.counter for describe textarea
    */
    function onRendered() {
        var me = this;
        var $root = this.$element;

        $root.find('[data-toggle="ets-checkbox"]').etsCheckbox();

        $root.find('#input-describe').counter({
            goal: 250
        });
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

        // validate describe area, if no empty then green marked the tick icon
        // or, grey out the tick icon
        'hub/st/describe/validate': function (topic, $element) {
            var me = this;
            var len = $.trim($element.val()).length;
            me.$element.find('.ets-describe-area').toggleClass('ets-valid', len !== 0);
        },

        // goto select image
        'hub/st/image/select': function (topic) {
            var me = this;
            console.log(topic);
            me.$element.find('.ets-select-image-area').attr('class', 'ets-select-image-area');
        },

        // goto image preview
        'hub/st/image/preview': function (topic) {
            var me = this;
            me.$element.find('.ets-select-image-area').addClass('ets-selected-image ets-valid');
        },

        // dom interaction
        'dom/action.input.click.focusin.focusout.mouseout.mouseover': $.noop,
        // add input event listener for describe textarea
        // TODO: it does not work in IE, should add IE compatible event listener later
        'dom/action/describe.input': function (topic, $e, index) {
            var me = this;
            var $target = $($e.target);

            me.publish('st/describe/validate', $target);
        },
        // focus and blue describe textarea
        'dom/action/describe.focusin.focusout': function (topic, $e, index) {
            togglePlaceholder.call(this, $e);
        },
        // hover in and out share info label
        'dom/action/agree.mouseover.mouseout': function (topic, $e, index) {
            var me = this;
            var $target = $($e.target);

            if ($e.namespace === 'mouseover') {
                $target.parent().addClass('share-info-hover');
            } else if ($e.namespace === 'mouseout') {
                $target.parent().removeClass('share-info-hover');
            }
        },
        // click image library
        'dom/action/library.click': function (topic, $e, index) {           
            var me = this;
            var $target = $($e.target);
            var imgUrl = $target.find('img').attr('src');

            me.$element.find('.ets-crop-area img').attr('src', imgUrl);

            me.publish('st/image/preview');

            $e.preventDefault();
        },

        // click change image button
        'dom/action/image/change.click': function (topic, $e, index) {
            var me = this;

            me.publish('st/image/select');

            $e.preventDefault();
        }

    })
});