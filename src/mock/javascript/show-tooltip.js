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

            $('body').bind('click',hideTooltip);
            
            //fix the location of the tooltip
            $tooltip = $parent.find('.ets-tooltip');
            $tooltip.css('margin-top',function (index, value){
                return -10-($(this).height()/2);
            });

            //todo:this need move outside as performance
            //fix the tooltip overflow-x
            var $container = $('#template-wrapper');
            var containerLeftBorder = $container.width() + $container.offset().left;
            var tooltipLeftBorder = $tooltip.offset().left + $tooltip.width()
            if( tooltipLeftBorder >= containerLeftBorder ){
                $tooltip.removeClass('ets-left-arrow');
                $tooltip.addClass('ets-right-arrow');
                $tooltip.css('left',function(){return -$tooltip.width();});
            }
        }
    });

    function hideTooltip(event){
        if(!$(event.target).closest('.ets-profile-wall .ets-on a').length){
            $li.removeClass('ets-on');
            $('body').unbind('click',hideTooltip);
        }
    }

    //control the add friend action 
    function addFriendTrigger(me , text ){
        me.addClass('ets-disabled');
        me.find('span').text(text);
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
    var defaultFoods = [
        {'imageUrl':'chinese_s','DescrText':'I am from Germany and I just love Chineese food!'},
        {'imageUrl':'hamburger_s','DescrText':'My favourite food is hamburgers. I love american food!'},
        {'imageUrl':'frenchfries_s','DescrText':'I think french fries tastes really good with ketchup. I would love to go to France some day!'},
        {'imageUrl':'pasta_s','DescrText':'Italian food is the best! Spagethi bolognese is my favourite dish'},
        {'imageUrl':'pizza_s','DescrText':'I like cheese and bread, so Pizza is the perfect dish for me! Yum!'},
        {'imageUrl':'sallad_s','DescrText':"I always try to eat healthy food, so for me a sallad is the perfect choise! It's green and fresh."},
        {'imageUrl':'salmon_s','DescrText':'For me fish is the best dish. I eat any fish, but I think Salmon is the best.'},
        {'imageUrl':'seafood_s','DescrText':'I live near the coast, and we always have fresh seafood. Grilled prawns is my absolute favourite'},
        {'imageUrl':'sushi_s','DescrText':'Sushi is so fresh and the perfect food in the summer. That is my favourite!'},
        {'imageUrl':'toast_s','DescrText':'Every morning I start with a toast. I like it very much because I can put whatever I want in it!'}        
    ];


    var alreadyFriend = 'Your are friends';
    var messageSent = 'Friend request sent';
    $li.not('.ets-profile-me').each(function(index){
        var random = Math.random();  
        var i = index >= 20 ? index - 20 : index >= 10 ? index - 10 : index; //get the random image

        var $img = $(this).find('img');
        $img.attr('src','mock/image/defaultOptions/'+ defaultFoods[i].imageUrl +'.jpg');

        var $DescrText = $(this).find('.ets-tooltip .ets-tooltip-content p').eq(0);
        $DescrText.text(defaultFoods[i].DescrText);

        var $friendBtn = $(this).find('.ets-tooltip .ets-tooltip-btns span.ets-btn-small').eq(0);
        mockRelationShip($friendBtn);
        
         //bind Add friend event
        if(!$friendBtn.hasClass('ets-disabled')){
           $friendBtn.click(function(){   
                addFriendTrigger($friendBtn , messageSent);
                return false;
            });
        }
    });
});