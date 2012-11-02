define([
	'jquery',
	'troopjs-core/component/widget',	
	'template!./demo.html',
	'troopjs-utils/deferred'
],function($,Widget,tDemo,Defered){	
	return Widget.extend(function(){

	},{
		'sig/start':function start(){
			var me = this;
			me.html(tDemo);
		}
	});
});