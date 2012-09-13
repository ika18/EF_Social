define(['compose',
    'jquery',
    'troopjs-core/component/widget',
    'troopjs-utils/deferred',
    'template!./main.html',
    'jquery.etsCheckbox',
    'jquery.counter',
    'jquery.ui'], function shareAndDescribe(Compose, $, Widget, Deferred, template) {
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

    var PREVIEW_WIDTH = 298;
    var PREVIEW_HEIGHT = 298;
    var WARN_TEXT_LENGTH = 240;
    var validSig = 0;

    function uploadFile () {
        var me = this;
        $('.fileupload').on('change', me.$element, function (e) {
            var file = $(this)[0].files[0];
            if (file) {
                getAsImage.call(me, file);
            }
        });
    }

    function getAsImage(file) {
        var me = this;
        var reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onprogress = $.proxy(progressHandler, me);
        reader.onload =  $.proxy(loadHandler, me);
        reader.onerror =  $.proxy(errorHandler, me);
    }

    function progressHandler(e) {
        var me = this;
    }

    function loadHandler (e) {
        var me = this;
        var $root = me.$element;
        var imgUrl = e.target.result;
        var image = new Image();
        var selectImgUrl = image.src = imgUrl;

        var $previewImage = $root.find('.ets-crop-area img');
        var $progressScreen = $root.find('.ets-gallery');
        var $galleryScreen = $root.find('.ets-progress-wrapper');
        var $cropScreen = $root.find('.ets-crop-area');

        selectedImage = imgUrl;

        $(image).load(function () {
            $previewImage.attr("src", imgUrl).css("cursor", 'move');

            me.publish('st/image/preview');

            var imgWidth = $previewImage.width();
            var imgHeight = $previewImage.height();

            if (imgWidth <= imgHeight) {
                $previewImage.css({
                    width: PREVIEW_WIDTH,
                    height: PREVIEW_WIDTH * imgHeight / imgWidth
                });
            } else {
                $previewImage.css({
                    width: PREVIEW_HEIGHT * imgWidth / imgHeight,
                    height: PREVIEW_HEIGHT
                });
            }

            var width = $previewImage.width() - PREVIEW_WIDTH;
            var height = $previewImage.height() - PREVIEW_HEIGHT;

            $previewImage.draggable({
                drag: function (e, ui) {
                    if (ui.position.left >= 0) {
                        ui.position.left = 0;
                    }
                    if (ui.position.top >= 0) {
                        ui.position.top = 0;
                    }
                    if (ui.position.left <= -width) {
                        ui.position.left = -width;
                    }
                    if (ui.position.top <= -height) {
                        ui.position.top = -height;
                    }
                }
            });
        });

       $('.fileupload').val('');
    }

    function errorHandler (e) {
        throw e;
    }

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
            uploadFile.call(me);
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

        _nextQues: function () {
            if (validSig === 2) {
                this.publish('navigation/nextStep/enabled', function () {
                    $('.ets-select-image-area').add('.ets-describe-area').addClass('ets-none');

                    $('.ets-profile-wall').removeClass('ets-none').find('.ets-profile-me').find('img').attr('src', $('.ets-crop-area img').attr('src')).end()
                    .find('.ets-tooltip-content').find('p:eq(0)').text($('#input-describe').val());
                });
            }
        },

        _validte: function ($element) {
            if (!$element.hasClass('ets-valid')) {
                $element.addClass('ets-valid');
                validSig++;
                this._nextQues();
            }  
        },

        // validate describe area, if no empty then green marked the tick icon
        // or, grey out the tick icon
        'hub/st/describe/validate': function (topic, $element) {
            var me = this;
            var len = $.trim($element.val()).length;
            if (len) {
                me._validte(me.$element.find('.ets-describe-area'));
            } else {
                me.$element.find('.ets-describe-area').removeClass('ets-valid');
            }
        },

        // goto select image
        'hub/st/image/select': function (topic) {
            var me = this;
            validSig--;
            me.$element.find('.ets-select-image-area').attr('class', 'ets-select-image-area');

        },

        // goto image preview
        'hub/st/image/preview': function (topic) {
            var me = this;
            validSig++;
            me.$element.find('.ets-select-image-area').addClass('ets-selected-image ets-valid');
            me._nextQues();
        },

        // dom interaction
        'dom/action.input.click.focusin.focusout.mouseout.mouseover': $.noop,
        // add input event listener for describe textarea
        // TODO: it does not work in IE, should add IE compatible event listener later
        'dom/action/describe.input': function (topic, $e, index) {
            var me = this;
            var $target = $($e.target);

            me.publish('st/describe/validate', $target);

            var $describeCounter = $('#input-describe_counter'); 
            var val = $.trim($target.val());        
            if(val.length >= WARN_TEXT_LENGTH){
                $describeCounter.addClass('ets-warning');
            }else{
                $describeCounter.removeClass('ets-warning');
            }
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
        'dom/action/library/item.click': function (topic, $e, index) {           
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
        },

        // upload an image
        'dom/action/image/upload.click': function (topic, $e, index) {
            var me = this;

            $('.fileupload').trigger('click');

            $e.preventDefault();
        },

        'dom/action/placeholder.click': function (topic, $e) {
            var me = this;
            var $target = $($e.target);

            $target.addClass('ets-none');

            $('#input-describe').focus();
        }

    })
});