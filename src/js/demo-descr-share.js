$(function(){

	var defaultDescr = 'Example';
	var msg = 'characters left';
	var $descrText = $('textarea#input-describe');
	var $descrArea = $('.ets-describe-area');
	var $nextButton = $('#next-step');
	var $DescrTextplaceholder = $('.ets-placeholder');
	var profileImgUrl,profileDescr;

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
		profileDescr = $descrText.val();
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
		$DescrTextplaceholder.addClass('ets-none');
	}).focusout(function(event) {
		if(!validDescr()){
			$DescrTextplaceholder.removeClass('ets-none');
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

		profileImgUrl = imageUrl;
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

	var gotoProfileWall = function(){
		$nextButton.unbind();
		$nextButton.click(function(){
			var me = $(this);
			if(!me.hasClass('ets-disabled')){
				showProfileWall();
				initMyProfile();
			}
		})		
	}

	var finishActivity = function(){
		$nextButton.unbind();
		$nextButton.click(function(){
			alert('finish activity');
		});
	}

	var showProfileWall = function(){
			$descrArea.addClass('ets-none');
			$selectImgArea.addClass('ets-none');
			$profileWall.removeClass('ets-none');

			finishActivity();
		}
	var showEditProfile = function(){
			$descrArea.removeClass('ets-none');
			$selectImgArea.removeClass('ets-none');
			$profileWall.addClass('ets-none');

			gotoProfileWall();
		}

	var initMyProfile = function(){
		var myprofile = $('.ets-profile-me');
		myprofile.find('.ets-tooltip-content p:first').text(profileDescr);
		myprofile.find('#edit-profile').click(function(){
			showEditProfile();
		});
	}

	gotoProfileWall();

	var $profileList = $profileWall.find('li');
	var addFriendsMessage = 'message be sent';

	var addFriend = function(me){		
		$(me).find('span').text(addFriendsMessage);
	}

	$profileList.click(function(){
		
		var me = $(this);
		var $etsTooltip = me.find('.ets-tooltip');

		if($etsTooltip.is(':hidden')){
		
			$profileList.find('.ets-tooltip:visible').hide();	
			$etsTooltip.css({'z-index':'2'}).show();

			$etsTooltip.find('.ets-btn-small[id!="edit-profile"]').bind('click',function(){
				addFriend(this);
				$etsTooltip.find('.ets-btn-small').unbind();
			});
		}
	})

});