define([
    "jquery",
    'troopjs-core/component/widget',
    'template!./main.html',
    'troopjs-utils/deferred'
], function DemoModule($, Widget, template, Deferred) {
	"use strict";

	function uploadFileEventRegist(){
		var me=this;
		$(me.$element).find(".fileupload").bind("change",function(){
			var file=$(this)[0].files[0];
			if(file){
				readImage.call(me,file);
			};
		});
		
	};


	function readImage(file){
		var me=this;
		var reader=new FileReader();

		reader.readAsDataURL(file);
		reader.onload=$.proxy(loadHandler, me);
		reader.onerror=$.proxy(errorHandler, me);

	};

	function loadHandler(e){
		var me=this;
		var $root=me.$element;
		var image=new Image();
		var data={
				"imageUrl": e.target.result
		};
		image.src=e.target.result;
		$(image).load(function(){
			me.publish("share-and-describe-screen/show", data);
		});

		
	};

	function errorHandler(e){
		throw e;
	};

	return Widget.extend({
		"sig/start": function(signal, deferred) {
			var me=this;
	        Deferred(function (renderDfd) {
	        	me.html(template, deferred);
	        	renderDfd.resolve();
	        }).done(function () {
	            uploadFileEventRegist.call(me);
	        });
		},
		
		// dom interaction
        'dom/action.input.click': $.noop,

		//upload image via manual
		"dom/action/image/upload.click":function(topic, $e, index){
			$(".fileupload").click();
			$e.preventDefault();
		}

	});

});