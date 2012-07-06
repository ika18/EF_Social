//textArea validation jQuery plugin 
(function ($) {
    $.fn.textareaValidate = function (options) {
        var _this = this;
        var settings = { minlimit: 5, maxlimit: 20, textChanged: null };

        if (options) {
            $.extend(settings, options);
        }


        //bind keydown event;
        $(_this).bind("keydown", function (e) {
            if (e.keyCode == 8) return;

            if (_this.getLength() >= settings.maxlimit) {
                if (!document.all) {
                    e.preventDefault();
                }
                else {
                    e.returnValue = false;
                }
            };

            _this.validate();
        });

        //bind keyup event;

        $(_this).bind("keyup", function () {
            var s = $(_this).attr("value");
            if (_this.getLength() > settings.maxlimit) {
                $(_this).attr("value", s.substring(0, settings.maxlimit));
            };

            _this.validate();

        });

        //get characters count
        _this.getLength = function () {
            var s = $(_this).attr("value");
            if (s)
                return $.trim(s).byteCount();
            else
                return 0;
        }

        _this.validate = function () {

            var result = new ValidateResult();

            result.result = true;
            result.msg = "correct";
            result.maxlimit = settings.maxlimit;
            result.minlimit = settings.minlimit;
            result.length = _this.getLength();

            if (result.length < settings.minlimit) {
                result.result = false;
                result.msg = "The typed character count should more than " + settings.minlimit;
            };

            if (result.length > settings.maxlimit) {
                result.result = false;
                result.msg = "The typed character count should less than " + settings.maxlimit;

            }

            if (settings.textChanged) {
                settings.textChanged(result);
            };

            return result;
        };

        _this.initialize = function () {
            return _this;
        };

        return _this.initialize();
    };


    function ValidateResult() {
        this.result = true;
        this.msg = "correct";
        this.maxlimit = 0;
        this.minlimit = 0;
        this.length = 0;

    }

    String.prototype.byteCount = function () {
        var len = this.length;
        for (var i = 0; i < this.length; i++) {
            if (this[i].match(/[^\x00-\xff]/g)) {
                len = len + 1;
            }
        }
        return len;
    };

})(jQuery);
