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

            // var offsetHeight = -($parent.height()/2);
            //fix the location of the tooltip
            $parent.find('.ets-tooltip').css('margin-top',function (index, value){
                return -10-($(this).height()/2);
            });
        }
    });

    //control the add friend action 
    function addFriendTrigger(me , text ){
        $(me).addClass('ets-disabled');
        $(me).find('span').text(text);
        //soem ajax request add friend
    }

    //mock some friends and some waiting conform request
    function mockRelationShip(me){
        var random = Math.random();        
        if(random < 0.3){ //friends            
            addFriendTrigger(me , alreadyFriend);
        }else if(random > 0.8){//waiting
            addFriendTrigger(me , messageSent);
        }
        
    }

    //mock the Default Image
    $link.find('img').each(function(index){

        var random = Math.random();  
        var i = index > 20 ? index - 20 : index > 10 ? index - 10 : index; //get the random image
        $(this).attr('src','mock/image/defaultOptions/'+ i +'.png');
    });

    var alreadyFriend = 'Your are friends';
    var messageSent = 'Friend request sent';
    //bind Add friend event
    $li.not('.ets-profile-me').find('.ets-tooltip .ets-tooltip-btns span.ets-btn-small').each(function(event) {

        mockRelationShip(this);

        var me = $(this);
        if(!me.hasClass('ets-disabled')){
           me.click(function(){   
                addFriendTrigger(me , messageSent);
                return false;
            });
        }
    });

    
});