/*
ok	1:check focus
ok	2:check input
3:choose default img
4:update image
5:clip image
6:next step
*/

$(function(){

	var defaultDescr = 'Example';
	var msg = 'characters left';
	var $descrText = $('.ets-describe-text textarea');
	var $descrArea = $('.ets-describe-area');
	var $nextButton = $('#next-step');

	var validDescr = function(){
		var result;
		if($descrText.val().length > 0){
			$descrArea.addClass('ets-valid');
			result = true;
		}else{
			$descrArea.removeClass('ets-valid');
			result = false;
		}
		validNextStep();
		return result;
	}

	var validImg = function(valid){
		if(valid){
			$selectImgArea.addClass('ets-valid');			
		}else{
			$selectImgArea.removeClass('ets-valid');
		}
		validNextStep();
	}

	var validNextStep = function(){
		if($selectImgArea.hasClass('ets-valid') && $descrArea.hasClass('ets-valid'))
		{
			$nextButton.removeClass('ets-disabled');
		}else{
			$nextButton.addClass('ets-disabled');
		}
	}

	$descrText.counter({
		'goal' : 150,
		'msg' : msg
	}).focusin(function(event) {
		var me = $(this);
		if(me.hasClass('ets-placeholder')){
			me.val('');
			me.removeClass('ets-placeholder');
		}
	}).focusout(function(event) {
		if(!validDescr()){
			$descrText.val(defaultDescr);
			$descrText.addClass('ets-placeholder');
		}

	}).keyup(function(event) {
		validDescr();
	});


	var $etsGallery = $('.ets-gallery');
	var $cropArea = $('.ets-crop-area');
	var $uploadImgBtn = $('#upload-image');	
	var $cancleImgBtn = $('#change-image');
	var $selectImgArea = $('.ets-select-image-area');
	var $file = $("input:file");
	var $cropImg = $cropArea.find('img');

	var selectImgBtnFun = function(){
		$uploadImgBtn.removeClass('ets-none');
		$cancleImgBtn.addClass('ets-none');
	}

	var cancleImgBtnFun = function(){
		$uploadImgBtn.addClass('ets-none');
		$cancleImgBtn.removeClass('ets-none');
	}

	var cropAreaFun = function(imageUrl){		
		$etsGallery.addClass('ets-none');

		var cropImg = $cropArea.find('img').attr('src',imageUrl);
		$cropArea.removeClass('ets-none');

		cancleImgBtnFun();

		validImg(true);
	}


	var getImageUrl = function(file,loaded){
		var fileReader = new FileReader();
		fileReader.readAsDataURL(file);
		fileReader.onload = function(e){
			cropAreaFun(e.target.result);
		}
	}

	$etsGallery.find('ul li a').attr('href','#').click(function(event) {
		var imageUrl = $(this).find('img:first').attr('src');
		cropAreaFun(imageUrl);
		$cropArea.find('img').addClass('resize');//when release to market don't need resize class
	});

	$uploadImgBtn.click(function(event) {
		$file.trigger('click');
	});

	$file.change(function(event) {
		console.log('me');
		var file = $file[0].files[0];
        if (file) {
            getImageUrl(file);   
        }
    });

	$cancleImgBtn.click(function(event) {
		
		validImg(false);

		selectImgBtnFun();	
		$cropArea.addClass('ets-none');
		$etsGallery.removeClass('ets-none');

		$cropArea.find('img').attr('src','').css({
			left:0,
			top:0,
			cursor: 'default'}).draggable("descroty").removeClass('resize');//when release to market don't need resize class

		$file.attr('value','');
	});

	
	$cropImg.draggable({
	 	drag:function(event,ui){	 		

	 		if(ui.position.left >= 0){
	 			ui.position.left = 0;
	 		}
	 		if(ui.position.top >= 0){
	 			ui.position.top = 0;	 			
	 		}

	 		var maxLeft = $cropImg.innerWidth() - $cropArea.innerWidth();
	 		maxLeft = maxLeft < 0 ? 0 : maxLeft;
	 		if( Math.abs(ui.position.left) >= maxLeft ){
	 			ui.position.left = -maxLeft;
	 		}

	 		var maxTop = $cropImg.innerHeight() - $cropArea.innerHeight();
	 		maxTop = maxTop < 0 ? 0 : maxTop;
	 		if( Math.abs(ui.position.top) >= maxLeft ){
	 			ui.position.top = -maxTop;
	 		}
	 	},
	 	cursor:"move"
	});

	var $profileWall = $('ul.ets-profile-wall');

	$nextButton.click(function(){
		var me = $(this);
		if(!me.hasClass('ets-disabled')){
			$descrArea.addClass('ets-none');
			$selectImgArea.addClass('ets-none');
			$profileWall.removeClass('ets-none')
		}
	})

	var $profileList = $profileWall.find('li');
	var addFriendsMessage = 'message be sent';
	var addFriend = function(me){		
			console.log(1);
			$(me).find('span').text(addFriendsMessage);

	}
	$profileList.click(function(){
		
		var me = $(this);
		var $etsTooltip = me.find('.ets-tooltip');

		if($etsTooltip.is(':hidden')){
		
			$profileList.find('.ets-tooltip:visible').hide();	
			$etsTooltip.css({'z-index':'2'}).show();

			$etsTooltip.find('.ets-btn-small').bind('click',function(){
				addFriend(this);
				$etsTooltip.find('.ets-btn-small').unbind();
			});
		}
	})

});