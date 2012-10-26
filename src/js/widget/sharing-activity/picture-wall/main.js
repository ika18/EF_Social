define([
    "jquery",
    'troopjs-core/component/widget',
    'template!./main.html',
    'troopjs-utils/deferred',
    'jquery.ui'
], function DemoModule($, Widget, template, Deferred) {
	"use strict";

	var _myPosition=10;
	var _isRendered=false;

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
		var p1=0,p2=_myPosition;

		if(myself && me._json){
			
			$(me._json).each(function (index, profile) {
				if(profile.isMe){
					profile.describe=myself.desc;
					profile.img= myself.imageUrl;
					profile.profile=myself.imageUrl;
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
		
		if(_isRendered){
			//render myself profile info;
			var myProfile=me._json[p2];
			renderMyself.call(me, myProfile);
			
			//show openning animation
			var isShowAnimation=(me.$element.find(".ets-msg-box").css("display"))=="none";
			//openingAnimation.call(me, deferred);
			if(isShowAnimation){
				openingAnimation.call(me, deferred);
				return;
			}
			
		}

		if(deferred){
			deferred.resolve();
		}
	}

	function renderMyself(data){
		var me=this;
		var $profileMe=me.$element.find("li.ets-profile-me");

		if(!data) return;
		$profileMe.find("img:eq(0)").attr("src",data.img);
		$profileMe.find(".ets-tooltip-content p:eq(0)").text(data.describe);
		$profileMe.find(".ets-preson-info img:eq(0)").attr("src", data.profile);
		$profileMe.find(".ets-preson-info .ets-name").text(data.name);
		$profileMe.find(".ets-preson-info .ets-location span").text(data.from);
		
		//locate position for profile tip and show it ;
		var $wrapper = $('.ets-act-st');
		me.edge = $wrapper.offset().left + 980;
		
	}

	function render (deferred) {
		var me=this;
		Deferred(function (dfd) {
			me.html(template, me._json, dfd);
		}).done(function () {
			_isRendered=true;
			if(deferred){
				deferred.resolve();
			}
		});
	}

	function openingAnimation(deferred){
		var $root=this.$element;
		var $tooltip= $root.find(".ets-profile-me .ets-tooltip");
		var $screenShadow= $root.find(".screen-shadow");

		$root.find('.ets-profile-me a').trigger('click');
		$tooltip.animate({opacity: "0.001"}, 0);
		$screenShadow.show().animate({
		   opacity:"0", 
		}, 500, function(){
			$tooltip.show().animate({ opacity:"1" }, 200, function(){
				$screenShadow.hide();
				if(deferred){
					deferred.resolve();
				};
			});
		});
	}

	function endingAnimation(deferred){
		var $tooltip= this.$element.find(".ets-profile-me .ets-tooltip");
		var $screenShadow= this.$element.find(".screen-shadow");

		$screenShadow.show().animate({
		   	opacity:"1", 
		}, 500, function(){
			$tooltip.animate({ opacity: "0.01", width: "toggle", height: "100%" }, 300 ,function(){
				if(deferred){
					deferred.resolve();
				};
			});
		});
	}

	return Widget.extend({
		"sig/initialize": function (signal, deferred) {
			var me=this;

			Deferred(function (dfd) {
				loadProfiles.call(me,dfd);
			}).done(function () {
				var data= me.$element.data("d");
				updateMyProfile.call(me, data, deferred);
			});
		},

		"sig/start": function(signal, deferred) {
			var me=this;
			render.call(me, deferred);
		},

		"hub/st/picture-wall/reload": function(topic, data){
			var me=this;
			if(data){
				updateMyProfile.call(me, data);
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
					data.imageUrl= profile.img;
					data.desc= profile.describe;
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
