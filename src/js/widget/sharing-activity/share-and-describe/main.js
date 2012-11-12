define(['compose',
    'jquery',
    'troopjs-core/component/widget',
    'troopjs-utils/deferred',
    'template!./main.html',
    'jquery.etsCheckbox',
    'jquery.counter',
    'jquery.ui'], function DemoModule(Compose, $, Widget, Deferred, template) {
    "use strict";

    var PREVIEW_WIDTH = 310;
    var PREVIEW_HEIGHT = 310;
    var WARN_TEXT_LENGTH = 190;
    var isShrinked = false;

    function previewImage(data){
        if(!data || !data.imageUrl) {
            return;
        };

        var $root= this.$element;
        var $previewImage= $root.find(".ets-corp-area img");
        
        $previewImage.attr("src", data.imageUrl);
        //avoid splash screen; 
        $previewImage.load(function success(argument) {
            $previewImage.css("cursor", 'move');
            var image= new Image();
            image.src=data.imageUrl;
            // get image's orginal width and height avoid be override;
            var imgWidth = image.width;
            var imgHeight = image.height;

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
    }

    function setValueForDescribe(data){
        var $inputDescribe=this.$element.find('#input-describe');
        
        $inputDescribe.val(function(){
            return (data && data.desc) ? data.desc : "";
        });
    };

    function countDescribe (data) {
        var me = this;
        var $inputDescribe = me.$element.find('#input-describe');
        var desc = (data && data.desc) ? data.desc : "";

        setValueForDescribe.call(me, data);

        //count describe
        $inputDescribe.counter({
            goal: 200
        });

        $('.share-info input:checkbox').etsCheckbox();

        //check describe valid
        me.publish('st/describe/validate', $inputDescribe);
    }

    function openingAnimation(deferred){
        var me=this;
        var $root=me.$element;
        
        if(isShrinked){
            magnifyAnimation.call(me, deferred);
        }else{
            $root.find(".ets-tooltip").hide();
            $root.animate({opacity:"1"}, 200, function(){
                $root.find(".ets-describe-area").show("slide", { direction: "left" }, 500, function(){
                    $root.find("#input-describe").focus();
                    $root.find(".ets-tooltip").show();
                    if(deferred){
                        deferred.resolve();
                    }
                });
            });
        };  
    }

    function endingAnimation(isShrink, deferred){
        var me=this;
        var $root=me.$element;

        Deferred(function(dfd){
            $root.find(".ets-tooltip").hide();
            //hide describe area
            $(".ets-describe-area").hide("slide", { direction: "left" }, 800, function(){
                dfd.resolve();
            });
        }).done(function(){
            if(isShrinked){
                shrinkAnimation.call(me, deferred);

            }else{
                $root.animate({opacity:"0.0"}, 500, function(){
                    deferred.resolve();
                });
            };

        }).fail(function(){
            deferred.fail();
        });

    }

    function shrinkAnimation(deferred){
        var me=this;
        var $root=me.$element;

        $root.find(".ets-tooltip").hide();
        $root.find(".ets-btn-change").hide();
        $root.find(".ets-profile-image img")
             .css({"width": "100%", "height": "100%"})
             .animate({left:0,top:0},0);
         
        $root.find(".ets-profile-image").animate({  
            height:"110",
            width:"110"
        },500,function(){
            isShrinked=true;
            deferred.resolve();
        });
    }

    function magnifyAnimation(deferred){
        var me=this;
        var $root=me.$element;

        Deferred(function(dfd){

            $(".ets-profile-image img")
                .css({"width": "100%", "height": "100%"})
                .animate({left:0, top:0 }, 0);

            $root.find(".ets-profile-image").delay(1000).animate({  
                height:"310",
                width:"310"
            },1500,function(){
                $root.find(".ets-btn-change").show();
                dfd.resolve();
            });
            
        }).done(function(){
            //show describe area
            $(".ets-describe-area").show("slide", { direction: "left" }, 800, function(){
                $root.find(".ets-tooltip").show();
                $root.find("#input-describe").focus();
                if(deferred){
                    deferred.resolve();
                }
            });
            
        });

    }

    function render(deferred){
        var me= this;
        var $root = me.$element;
        
        Deferred(function (renderDeferred) {
            me._json= $root.data("d");
            me.html(template, me._json, renderDeferred);
        }).done(function(){
            onRendered.call(me);
            deferred.resolve();
        });

    }

    function onRendered() {
        var me = this;

        previewImage.call(me, me._json);
        countDescribe.call(me, me._json);

        me.$textarea = me.$element.find('textarea');

        me.$describeCounter = $('#input-describe_counter'); 
    }
    
    return Widget.extend({
        'sig/initialize': function (signal, deferred) {
            render.call(this, deferred);
        },

        "hub/st/share-and-describe/reload": function (topic, data){
            var me=this;
            if(data){

                if(isShrinked){
                    Deferred(function(dfd){
                        openingAnimation.call(me, dfd)
                    }).done(function(){
                        previewImage.call(me, data);
                    });
                }else{
                    previewImage.call(me, data);
                    openingAnimation.call(me);
                }

            }
        },

        "hub/st/describe/validate":function (topic, $el) {
            var me=this;
            var len = $.trim($el.val()).length;
            var $completeBtn = $("#btn-complete");

            $completeBtn.toggleClass("ets-disabled", (len <= 0));
        },

        // dom interaction
        'dom/action.input.click.focusin.focusout.EFTextChange': $.noop,
        // submit describe
        'dom/action/submit/describe.click': function (topic, $e) {
            var me = this;
            var $target = $($e.target);
            if ($target.hasClass('ets-disabled')) {
                return;
            }

            var data = {
                "imageUrl": me.$element.find(".ets-corp-area img").attr("src"),
                "desc": me.$element.find("#input-describe").val()
            };

            //play ending animation
            Deferred(function(dfd){
                isShrinked = true;
                endingAnimation.call(me, true, dfd);
            }).done(function () {
                me.publish("picture-wall-screen/show",data);
            }).fail(function () {
                throw "share and describe: submit error";
            });
        },

        //change image
        "dom/action/image/change.click":function(topic, $e){
            var me=this;

            Deferred(function(dfd){
                isShrinked=false;
                endingAnimation.call(me, false, dfd);
            }).done(function(){
                var data={};
                me.publish("choose-picture-screen/show",data);
                $e.preventDefault();
            });
        },
        "dom/action/describe.EFTextChange":function (topic, $e) {
            var me = this;
            var $target = $($e.target);

            me.publish('st/describe/validate', $target);

            var val = $.trim($target.val()); 
  
            if(val.length >= WARN_TEXT_LENGTH){
                me.$describeCounter.addClass('ets-warning');
            } else {
                me.$describeCounter.removeClass('ets-warning');
            }
        },
        'dom/action/describe.focusin': function (topic, $e) {
            var me = this;
            var $target = $($e.target);

            $target.closest('.ets-describe-area').addClass('ets-focus');
        },
        'dom/action/describe.focusout': function (topic, $e) {
            var me = this;
            var $target = $($e.target);

            $target.closest('.ets-describe-area').removeClass('ets-focus');
        }

    });

});
