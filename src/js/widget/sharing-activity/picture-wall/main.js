define([
    "jquery",
    'troopjs-core/component/widget',
    'template!./main.html',
    'troopjs-utils/deferred',
    'jquery.ui'
], function DemoModule($, Widget, template, Deferred) {
	"use strict";

	var MYPOSITION=10;

	function loadProfiles (deferred) {
		var me=this;

		$.get("mock/data/profile-item.json")
		 .done(function (res) {
			me._json=res;
			deferred.resolve();
		}).fail(function () {
			deferred.fail();
			throw "Load user profile failed";
		});
	}

	function updateMyProfile (data, deferred) {
		var me= this;
		var myself= data;
		var p1=0,p2=MYPOSITION;

		if(myself && me._json){
			
			$(me._json).each(function (index, profile) {
				if(profile.isMe){
					profile.describe=myself.desc;
					profile.img= myself.imgUrl;
					profile.profile=myself.imgUrl;
					p1=index;
				};
			});
			
		};
		//fix position
		if(p1>=0 && p2>=0 && p1<=me._json.length && p2<=me._json.length){
			var temp=me._json[p1];
			me._json[p1]=me._json[p2];
			me._json[p2]=temp;
		};

		if(deferred){
			deferred.resolve();
		};
		
	}

	function render (deferred) {
		var me=this;
		Deferred(function (dfd) {
			me.html(template, me._json, dfd);
		}).done(function () {
			var $root=this.$element;
			var $wrapper = $('.ets-act-st');
	        me.edge = $wrapper.offset().left + 980;
			openingAnimation.call(me, deferred);
		});
	}

	function openingAnimation(deferred){
		var me=this;
		var $root=me.$element;
		var $others=$root.find(".ets-profile-wall li").not(".ets-profile-me");
		var $tooltip=$root.find(".ets-profile-me .ets-tooltip");

		$others.animate({opacity: "0.001"}, 0);
		$tooltip.animate({opacity: "0.001"}, 0);

		//TODO: it is just expediency, should be reflactor
		var len=$others.length;
		$others.animate({opacity: "1"}, 800, function(){
			--len;
			if(len==0){
				$tooltip.animate({ opacity:"1" }, 200, function(){
					if(deferred){
						deferred.resolve();
					};
				});
			};
		});
		
	}

	function endingAnimation(deferred){
		var me=this;
		var $others=$(".ets-profile-wall li").not(".ets-profile-me");
		var $tooltip=$(".ets-profile-me .ets-tooltip");

		//TODO: it is just expediency, should be reflactor
		var len=$others.length;
		$others.animate({opacity:"0.01"},500, function(){
			--len;
			if(len==0){
				$tooltip.animate({ opacity: "0.01", width: "toggle", height: "100%" }, 500, function(){
     			if(deferred){
					deferred.resolve();
				};
			});
			}
    		
		});
		
		//$tooltip.animate({ opacity: 0, width: "toggle", height: "100%" }, 500, deferred.resolve);

	}

	return Widget.extend({
		"sig/initialize": function (signal, deferred) {
			var me=this;
			Deferred(function (dfd) {
				loadProfiles.call(me,dfd);
			}).done(function () {
				var data= me.$element.data("d");
				updateMyProfile.call(me, data, deferred);
			}).fail(function () {
				deferred.fail();
			});
		},

		"sig/start": function(signal, deferred) {
			var me=this;
			render.call(me, deferred);
		},

		"hub/st/picture-wall/reload": function(topic, data){
			var me=this;
			if(data){
				Deferred(function(dfd){
					updateMyProfile.call(me, data, dfd);
					render.call(me,dfd);
				}).done(function(){

				});
			};
		},

		"dom/action.click":$.noop,

        'dom/action/profile/item.click': function (topic, $e) {
            var me = this;
            var $target = $($e.target);
            var $li = $target.closest('li');
            var $tooltip = $target.next();

            $li.siblings().removeClass('ets-on').end()
            .toggleClass('ets-on');

            var height = $tooltip.height();
            var width = $tooltip.width();

            $tooltip.css('margin-top', - (height / 2));
            if (me.edge - $tooltip.offset().left < width) {
                $tooltip.addClass('ets-right-arrow');
            }

            $(document).on('click', function (e) {
                if (!$(e.target).closest($tooltip).length) {
                    $li.removeClass('ets-on');
                    $(document).off(e);
                }
            });

            $e.preventDefault();
        },
		
		"dom/action/edit-profile.click":function (topic, $e, index) {
			var me=this;
			var data={};
			$(me._json).each(function (index, profile) {
				if(profile.isMe){
					data.imgUrl=profile.img;
					data.imageUrl=profile.img;
					data.desc=profile.describe;
				};
			});
			
			Deferred(function(dfd){
				endingAnimation.call(me, dfd);
				return;
			}).done(function(){
				me.publish("share-and-describe-screen/show", data);
			});
			
			$e.preventDefault();
		},
		
		'dom/action/friend/add.click': function (topic, $e) {
            var $target = $($e.target);

            $target.addClass('ets-disabled').text('Friend request sent')
            .removeAttr('data-action');

            $e.preventDefault();
        }
	});

});
