require.config({
    paths: {
        "troopjs-bundle": "lib/troopjs/troopjs-bundle",
        "jquery" : "../_shared/jquery/1.7.2/jquery.min",
        "jquery.ui": "../_shared/jquery-ui/1.8.22/jquery-ui.min",

        // jquery plugin
        'jquery.etsCheckbox': 'ets-checkbox',
        'jquery.counter': 'lib/jquery-counter/2.2/jquery.counter'
    },
    shim: {
        'jquery.ui': ['jquery'],
        'jquery.etsCheckbox': ['jquery'],
        'jquery.counter': ['jquery']
    },
    "map" : {
        "*" : {
            "template" : "troopjs-requirejs/template"
        }
    }
});

require(['require','jquery', 'troopjs-bundle'], function App(require, $) {
    "use strict";

    require(["widget/application",
        "troopjs-jquery/weave",
        "troopjs-jquery/destroy",
        "troopjs-jquery/action",
        "troopjs-jquery/resize", 
        "troopjs-jquery/dimensions", 
        "troopjs-jquery/hashchange"], function App(Application) {
            $(document).ready(function () {
                Application($(this.documentElement), "app/sharedescribe").start();

            });
    });
});