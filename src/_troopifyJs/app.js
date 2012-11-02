require.config({
	paths : {
		troopjs : '/js/lib/troopjs/troopjs-bundle',
		jquery  : '/_shared/jquery/1.8/jquery.min'
	},
	shim : {
		'troopjs':['jquery'],
		'troopjs-jquery/weave' : {
			deps: ['jquery','troopjs']
		}
	},
    "map" : {
        "*" : {
            "template" : "troopjs-requirejs/template"
        }
    }
});

require(['require','jquery','troopjs'],function(parentsRequire,$){
	parentsRequire(['troopjs-core/widget/application','troopjs-jquery/weave'],function(Application){
		$(document).ready(function($) {
			Application($(this.documentElement), "app/sharedescribe").start();
		});
		
	})
});
