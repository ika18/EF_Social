define([
    "jquery",
    'troopjs-core/component/widget',
    'template!./main.html',
    'troopjs-utils/deferred'
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


	};

	function updateMyProfile (deferred) {
		var me= this;
		var myself= me.$element.data("d");

		if(myself && me._json){
			var p1=0,p2=MYPOSITION;
			$(me._json).each(function (index, profile) {
				if(profile.isMe){
					profile.describe=myself.desc;
					profile.img= myself.imgUrl;
					profile.profile=myself.imgUrl;
					p1=index;
				};
			});
			if(p1>=0 && p2>=0 && p1<=me._json.length && p2<=me._json.length){
				var temp=me._json[p1];
				me._json[p1]=me._json[p2];
				me._json[p2]=temp;
			};
		};

		deferred.resolve();
	};

	function render (deferred) {
		var me=this;

		Deferred(function (dfd) {
			me.html(template, me._json, dfd);
		}).done(function (argument) {
			var $wrapper = $('.ets-act-st');
	        me.edge = $wrapper.offset().left + 980;
	        deferred.resolve();
		});
		
	}



	return Widget.extend({
		"sig/initialize": function (signal, deferred) {
			var me=this;

			Deferred(function (dfd) {
				loadProfiles.call(me,dfd);
			}).done(function () {
				updateMyProfile.call(me,deferred);
			}).fail(function () {
				deferred.fail();
			});
		},

		"sig/start": function(signal, deferred) {
			var me=this;
			render.call(me, deferred);
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
		
		"dom/action/edit/profile.click":function (topic, $e, index) {
			var me=this;
			var myself= me.$element.data("d");
			var data={
				imageUrl: myself.imgUrl,
				desc: myself.desc,
				shared:true
			};
			me.publish("share-and-describe-screen/show", data);
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
