/**
 * value change event for input or textarea,still has bug on IE9, can't detect delete with contextmenu immediately
 */
define(['jquery',
        'troopjs-core/component/widget',
        "troopjs-utils/deferred"], function ($, Widget, Deferred) {
          'use strict';

          var UNDEFINE;
    var EVT_TXTCHANGE = (function () {
        if (!$.browser.msie) {
            return "input";
        } else {
            if ($.browser.version < 9.0) {
                return "propertychange";
            } else if ($.browser.version == 9.0) {
                /**
                 * for ie9, propertychange and input exist bugs.
                 * propertychange can only work with attachEvent
                 * input can't detect value change set by js
                 * propertychange and input can't detect:
                 * 1.backspace with keyboard    : use keydown and keyCode to detect
                 * 2.delete with keyboard       : use keydown and keyCode to detect
                 * 3.delete with contextmenu    : disable contextmenu on input element
                 * 4.cut                        : use cut to detect
                 * 5.ctrl+Z/ctrl+Y              : use keydown and keyCode to detect
                 * 6.drag out                   : use change to detect
                 * 7.will trigger many times with multiple lines' paste : can't resolve
                 */
                return "keydown cut change";
            } else {
                return "input propertychange";
            }
        }
    })(),
    EVT_CUSTOMER_TEXT_CHANGE = 'EFTextChange';
    /**
      * Check event whether need to trigger textchange event
      */
    function filterEvent(e){
        var orge = e.originalEvent;
        if (orge === UNDEFINE) {
          return;
        }
        if ($.browser.msie && $.browser.version == 9.0) {
            /** For keydown event, only need to trigger value change when:
              * DELETE/BACKSPACE
              * CTRL+Z/CTRL+Y
              **/
            if (orge.type === 'keydown'
                 &&
                !(orge.keyCode == 0x2E || orge.keyCode == 0x8)
                 &&
                !(orge.ctrlKey && (orge.keyCode == 90 || orge.keyCode == 89))) {
                return;
            }
        }
        
        //Filter not value attribute change of propertychange
        if (orge.propertyName && orge.propertyName != 'value'){
            return;
        }
        return true;
    }
    
    function triggerChangeEvent($DOM){
        //Use setTimeout to get real value, some events like paste|cut|ctrl+z|ctrl+y,can't get real value immediately
        setTimeout(function () {
            $DOM.trigger(EVT_CUSTOMER_TEXT_CHANGE);
        },0);
    }
    
    return Widget.extend({
        "sig/initialize" : function onStart(signal, deferred) {
            var me = this,
                $ROOT = me.$element,
                domEle = $ROOT.get(0);
            if($.browser.msie && $.browser.version == 9.0){
                domEle.attachEvent && domEle.attachEvent("oncontextmenu",function(e){
                    return false;
                }) && domEle.attachEvent("onpropertychange", function(e){
                    filterEvent($.Event(e)) && triggerChangeEvent($ROOT);
                });
            }
            $ROOT.bind(EVT_TXTCHANGE,function(e){
                filterEvent(e) && triggerChangeEvent($ROOT);
            });
            deferred && deferred.resolve();
        }
    });
});
