define([
    "jquery",
    'troopjs-core/component/widget',
    'template!./main.html',
    'troopjs-utils/deferred'
], function DemoModule($, Widget, template, Deferred) {
	"use strict";


	return Widget.extend(function(signal,deferred){
		
	},{
		"sig/initialize":function(signal, deferred){
			var me=this;

			//load data from backend 
			$.get('mock/data/image-options.json').done(function(jd){
				me._json=jd;
				deferred.resolve();
			}).fail(function(){
				throw "Load default image options error";
			});

		},
		"sig/start": function(signal, deferred) {
			var me=this;
			me.html(template,me._json);
			if(deferred){
				deferred.resolve();
			}
		},
		
		// dom interaction
        'dom/action.input.click.focusin.focusout.mouseout.mouseover': $.noop,
        
        //choose image library option
		"dom/action/image-library/item.click":function(topic, $e, index){
			var me=this;
			var data={
				"imageUrl": $($e.target).find("img").attr("src")
			};
			me.publish("share-and-describe-screen/show",data);
			$e.preventDefault();
			
		}

	});

});