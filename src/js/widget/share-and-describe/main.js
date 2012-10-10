define([
    "jquery",
    'troopjs-core/component/widget',
    'template!./main.html',
    'troopjs-utils/deferred'
], function DemoModule($, Widget, template, Deferred) {
	"use strict";

	return Widget.extend({
		"sig/start": function(signal, deferred) {
			var me=this;
			me.html(template);
		}

	});

});