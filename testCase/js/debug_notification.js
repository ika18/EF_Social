(function () {
	var baseUrl = "http://cns-723:8888/EF_Social/testCase/";
	var $root;
	var $config;
	var $debugConfig;
	var $showNotification;
	var $notification;
	var liveGameContext;

	var util = {
		loadScript: function (url, callback) {
			var head = document.getElementsByTagName('head')[0]; 
			var script = document.createElement('script'); 
			script.type = "text/javascript"; 
			script.src = url; 
			head.appendChild(script);

			if (callback) {
				script.onload = function () {
					callback();
				};
			}
		},
		loadStyle: function (url) {
			var head = document.getElementsByTagName('head')[0]; 
			var link = document.createElement('link'); 
			link.type = "text/css";
			link.rel = "stylesheet";
			link.href = url; 
			head.appendChild(link);
		},
		checkNamespace: function (namespace) {
	        var dep = namespace.split('.');
	        var o = window;
	        var output = true;

	        for (var i = 0; i < dep.length; i++) {
	            if (typeof o[dep[i]] === 'object') {
	                o = o[dep[i]];
	            }
	            else {
	                output = false;
	                break;
	            }
	        }
	        return output;
	    }
	};

	var init = function ($) {
		$notification = $('.notificationBox');
		if (!util.checkNamespace('ET.School.Social.LiveGame.Context') || !$notification.length || !$('#cim-livegame:visible').length) {
			alert('Sorry, live game feature seems not be prepared!');
			return;
		}

		$('#social_debug').remove();

		var template = '<div id="social_debug"> <form action="#"> <fieldset> <div class="row"> <div class="label">Game notification:</div> <div class="field"> <label> <input type="radio" name="setNotification" value="1">Enable </label> <label> <input type="radio" name="setNotification" value="0">Disable </label> </div> </div> <div class="row"> <div class="label">Show notification:</div> <div class="field"> <select name="showNotification" class="long"> <option value="0">----------- please select -----------</option> <option value="1">show single player notification</option> <option value="2">show multi-player notification</option> <option value="3">show Live POC</option> </select> </div> </div> <div class="buttons"> <div class="cancel"> </div> <div class="submit"> <button id="closeBtn">Close widget</button> </div> </div> </fieldset> </form> </div>';
		// load debug css
		util.loadStyle(baseUrl + 'css/debug.css');

		$('body').append($(template));

		$root = $('#social_debug');
		
		liveGameContext = ET.School.Social.LiveGame.Context
		$config = $('.cim-livegame-config input[type=checkbox]');
		$debugConfig = $root.find('input[name="setNotification"]');
		$showNotification = $root.find('select[name="showNotification"]');
		

		setDebugConfig();

		stylingRoot();
		registerEvents();
	};

	var stylingRoot = function () {
		$root.css({
			position: 'fixed',
			width: '30px',
			right: 0,
			top: 30
		});
	};

	var registerEvents = function () {
		rootEvent();

		configNotifiaction();
		showNotification();
		closeWidget();
	};

	var rootEvent = function () {
		$root.bind({
			mouseenter: function (e) {
				$root.width(450);
			},
			mouseleave: function (e) {
				$root.width(30);
			}
		});
	};

	var configNotifiaction = function () {
		// var prefix = 'http://' + location.hostname;
		var url = '/services/shared/social/wordquiz/notificationsettings';
		
		$debugConfig.click(function (e) {
			console.log($(this).val());
			$.ajax({
	            url: '/services/shared/social/wordquiz/notificationsettings',
	            data: {
	                source_id: ET.Community.context.clientId,
	                enabled: $(this).val() === '1' ? 'true' : 'false',
	                token: liveGameContext.LiveGameToken,
	                utcDateToken: liveGameContext.UTCLiveGameToken
	            },
	            success: function (data) {
	                liveGameContext.NotificationSettings = data;
	                setConfig();
	            },
	            type: 'POST'
	        });
		});
	};

	var setConfig = function () {
		$config.attr('checked', liveGameContext.NotificationSettings ? '' : 'checked')
	};

	var setDebugConfig = function () {
		if (liveGameContext.NotificationSettings) {
			$debugConfig.eq(0).attr('checked', 'checked');
		} else {
			$debugConfig.eq(1).attr('checked', 'checked');
		}
	};

	var showNotification = function () {
		$showNotification.change(function (e) {
			var val = $(this).val();
			
			console.log($notification);
			switch (val) {
				case '0':
					$notification.hide();
					break;
				case '1':
					$notification.show().removeClass('multiple-player');
					break;
				case '2':
					$notification.show().addClass('multiple-player');
					break;
				default:
					alert('coming soon...');
					break;
			}
		});
	};

	var closeWidget = function () {
		$('#closeBtn').click(function () {
			$root.remove();
			return false;
		});
	};

	if (!window.jQuery) {
		util.loadScript('http://code.jquery.com/jquery-latest.min.js', function () {
			init(jQuery);
		});
	} else {
		init(jQuery);
	}
}());
void(0);