(function ($) {
    var Checker = function (element) {
        var $element = $(element);
        var wrap = "<div class='ets-checkbox'></div>"
        $element.wrap(wrap);
        var $wrapper = $element.parent();
        var $label = $('label[for="' + $element.attr("id") + '"]');

        $element.bind('checker:set', function (e) {
            if ($element.prop('checked')) {
                $wrapper.addClass('ets-checkbox-checked');
            } else {
                $wrapper.removeClass('ets-checkbox-checked');
            }
        });

        $label.bind('hover', function (e) {
            if (e.type === "mouseenter") {
                $wrapper.addClass('ets-checkbox-hover');
            } else if (e.type === "mouseleave") {
                $wrapper.removeClass('ets-checkbox-hover');
            }
        })
        .bind('click', function (e) {
            $element.prop('checked', !$element.prop('checked'));
            $element.trigger('checker:set');
        });

        $element.trigger('checker:set');
    };

    $(function () {
        $('[data-toggle="ets-checkbox"]').each(function () {
            new Checker(this);
        });
    });
})(window.jQuery);