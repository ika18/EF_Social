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
    var WARN_TEXT_LENGTH = 240;

	var render=function(deferred){
		var me= this;
		var $root= me.$element;
		
		Deferred(function(dfd){
			me._json= $root.data("d");
			me.html(template, me._json, dfd);
		}).done(function(){
			previewImage.call(me);
			countDescribe.call(me);
		}).done(function(){
			deferred.resolve();
		});

	};



	function previewImage(){
		var $root=this.$element;
		var imgUrl=$root.data("d").imageUrl;
		var $previewImage=$root.find(".ets-corp-area img");

		$previewImage.attr("src", imgUrl);
		$previewImage.load(function success(argument) {
			$previewImage.css("cursor", 'move');

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

	};

	function countDescribe () {
		var me=this;
		var $root=me.$element;
		var $inputDescribe=$root.find('#input-describe');

		//count describe
		$inputDescribe.counter({
            goal: 200
        }).val(function () {
        	var desc=$root.data("d").desc;
        	return desc ? desc : "";
        });

        $('.share-info input:checkbox').etsCheckbox();

        //make effect enable
        $root.find(".ets-describe-area").effect( "slide");
        //check describe valid
        me.publish('st/describe/validate', $inputDescribe);
	}

	function onSubmit (argument) {
		var me=this;
		var $root=me.$element;
		var data={
			"imgUrl": $root.find(".ets-corp-area img").attr("src"),
			"desc": $root.find("#input-describe").val()
		};

		me.publish("picture-wall-screen/show",data);
	}

	
	return Widget.extend({
		"sig/start": function(signal, deferred) {
			var me=this;
            render.call(me, deferred);
		},

		"hub/st/describe/validate":function (topic, $element) {
			var me=this;
			var len = $.trim($element.val()).length;
			var $completeBtn=$("#btn-complete");

			$completeBtn.unbind();
			if(len){
				$completeBtn.removeClass("ets-disabled").addClass("ets-abled");
				$completeBtn.bind("click", $.proxy(onSubmit, me));

			}else{
				$completeBtn.removeClass("ets-abled").addClass("ets-disabled");
			};
			
		},

		// dom interaction
        'dom/action.input.click.focusin.focusout.mouseout.mouseover': $.noop,

        //change image
		"dom/action/image/change.click":function(topic, $e, index){
			var me=this;
			var data={};
			me.publish("choose-picture-screen/show",data);
			$e.preventDefault();
		},

		"dom/action/describe.input":function (topic, $e, index) {
			var me=this;
			var $target = $($e.target);

			var $describeCounter = $('#input-describe_counter'); 
			me.publish('st/describe/validate', $target);

            var $describeCounter = $('#input-describe_counter'); 
            var val = $.trim($target.val());        
            if(val.length >= WARN_TEXT_LENGTH){
                $describeCounter.addClass('ets-warning');
            }else{
                $describeCounter.removeClass('ets-warning');
            }
		}

	});

});
