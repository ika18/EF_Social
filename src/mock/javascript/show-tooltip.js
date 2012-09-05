$(function () {
    var $li = $('.ets-profile-wall').find('li');
    var $link = $li.find('a');

    $link.click(function (e) {
        e.preventDefault();
        var $me = $(this);
        var $parent = $me.parent();

        if ($parent.hasClass('ets-on')) {
            $parent.removeClass('ets-on');
        } else {
            $li.removeClass('ets-on');
            $parent.toggleClass('ets-on');
        }
    });

    //control the add friend action 
    function addFriendTrigger(me , text ){
        $(me).addClass('ets-disabled');
        $(me).find('span').text(text);
        //soem ajax request add friend
    }

    //mock some friends and some waiting conform request
    function mockSomeFriends(relationShip){
        var random = Math.random();        
        if(random < 0.3){ //friends            
            addFriendTrigger(relationShip , alreadyFriend);
        }else if(random > 0.8){//waiting
            addFriendTrigger(relationShip , messageSent);
        }
    }

    var alreadyFriend = 'Your are friends';
    var messageSent = 'Friend request sent';
    //bind Add friend event
    $li.not('.ets-profile-me').find('.ets-tooltip .ets-tooltip-btns span.ets-btn-small').each(function(event) {

        mockSomeFriends(this);

        var me = $(this);
        if(!me.hasClass('ets-disabled')){
           me.click(function(){   
                addFriendTrigger(me , messageSent);
                return false;
            });
        }
    });

    
});