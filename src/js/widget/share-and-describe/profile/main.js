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
            onRender.call(me);


            deferred.resolve();
        });

    }

    function onRender() {
        var $wrapper = $('.ets-act-st');

        this.edge = $wrapper.offset().left + 980;
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
            var $li = $target.closest('li');
            var $tooltip = $target.next();

            $li.siblings().removeClass('ets-on').end()
            .toggleClass('ets-on');

            var height = $tooltip.height();
            var width = $tooltip.width();

            $tooltip.css('margin-top', - (height / 2));

            if (me.edge - $tooltip.offset().left < width) {
                $tooltip.addClass('ets-right-arrow');
            }

            $(document).on('click', function (e) {
                if (!$(e.target).closest($tooltip).length) {
                    $li.removeClass('ets-on');
                    $(document).off(e);
                }
            });

            $e.preventDefault();
        },
        'dom/action/edit/profile.click': function (topic, $e) {
            $('.ets-select-image-area').add('.ets-describe-area').removeClass('ets-none');

            $('.ets-profile-wall').addClass('ets-none');
        },
        'dom/action/friend/add.click': function (topic, $e) {
            var $target = $($e.target);

            $target.addClass('ets-disabled').text('Friend request sent')
            .removeAttr('data-action');

            $e.preventDefault();
        }
    });
});