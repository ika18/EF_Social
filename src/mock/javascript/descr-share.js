$(function(){
	//descr area valid logic
	var checkTextLength = function(text , minLength){
		if(typeof text === 'undefined'){
			return false;
		}
		if(typeof minLength === "undefined"){
			minLength = 0;
		}
		if(text.length > minLength){
			return true;
		}else{
			return false;
		}		
	};

	var myDescribe;
	var $textPlaceHolder = $('.ets-placeholder');
	var validText = function(text){
		var val = $.trim($describe.val());
		if(checkTextLength(val)){
			$textPlaceHolder.hide();
			$describeArea.addClass('ets-valid');
		}else{
			$textPlaceHolder.show();
			$describeArea.removeClass('ets-valid');
		}
		myDescribe = val;
		$describeArea.trigger('change:tick');
	};

	var $describeArea = $('.ets-describe-area');
	var $describe = $('#input-describe');
	var defaultMaxTextLength = 250;
	function initDescrArea(){
		//init textarea
		$describe.counter({
        	goal: defaultMaxTextLength
    	});

		//bind valid text event handler
		$describeArea.focusin(function(event) {
			$textPlaceHolder.hide();
		}).bind('input , focusout',function(e){			
			validText();
		});
	}

	//image area valid logic	
    var previewWidth = 328;
    var previewHeight = 292;
    var $cropScreen = $('.ets-crop-area');
	var $previewImage = $cropScreen.find('img');	
	var prepareCropImg = function(imgurl){
		$previewImage.attr("src", imgurl);
		//fix default width not enough
		$previewImage[0].onload = function(){
			if($previewImage.width() < previewWidth 
					&& $previewImage.height() < previewHeight){
				$previewImage.css({
					width : previewWidth,
					height : previewHeight
				});
			}
		};
	};


	var guideToCropImgArea = function(){
		$galleryScreen.addClass('ets-none');
    	$progressScreen.addClass('ets-none');
    	$uploadBtn.addClass('ets-none');

    	$cropScreen.removeClass('ets-none');
    	$changeImageBtn.removeClass('ets-none');
    
    	$imageArea.addClass('ets-valid');
    };

	var selectedImgUrl;
	var $imageArea = $('.ets-select-image-area');
	var $galleryScreen = $('.ets-gallery');
	var $imgLib = $galleryScreen.find('li a');
	var $progressScreen = $('.ets-progress-wrapper');
	var $cropScreen = $('.ets-crop-area');
	var $uploadBtn = $('#upload-image');
	var $changeImageBtn = $('#change-image');
	function initSelectImage(){
		$imgLib.click(function(event) {
			//prepare the img 
			selectedImgUrl = $(this).find('img').attr('src');
			prepareCropImg(selectedImgUrl);
		
			//guide to crop imag area 
	        guideToCropImgArea();
			
			//trigger change:tick
			$imageArea.trigger('change:tick');

			//block bubble and default handler
			return false;
		});
	}

    var makeCropImgDragable = function(){
		var imgWidth = $previewImage.width();
        var imgHeight = $previewImage.height();

        if (imgWidth <= imgHeight) {
            $previewImage.css({
                width: previewWidth,
                height: previewWidth * imgHeight / imgWidth
            });
        } else {
            $previewImage.css({
                width: previewHeight * imgWidth / imgHeight,
                height: previewHeight
            });
        }

        var width = $previewImage.width() - previewWidth;
        var height = $previewImage.height() - previewHeight;

        $previewImage.draggable({
            drag: function (e, ui) {
                if (ui.position.left >= 0) {
                    ui.position.left = 0;
                }
                if (ui.position.top >= 0) {
                    ui.position.top = 0;
                }
                if (ui.position.left <= -width) {
                    ui.position.left = -width;
                }
                if (ui.position.top <= -height) {
                    ui.position.top = -height;
                }
            }
        });
    }

	var getImageUrlByFile = function(file){
		
		//prototype : use html5 filereader
		var dfd = $.Deferred();
		var fileReader = new FileReader();		
		fileReader.onload = function(e){
			selectedImgUrl = e.target.result;
			dfd.resolve();
		};
		fileReader.onerror = function(e){
			//action about error handler
		};
		fileReader.readAsDataURL(file);
		return dfd.promise();


		//rtm : use upload server
		//...
	};

	var $file = $('input:file');
	function initUploadBtn(){
		$uploadBtn.click(function (e) {
        	if ($uploadBtn.hasClass('ets-disabled')) {
            	return;
        	}
        	$file.trigger('click');
    	});

    	$file.change(function (e) {
        	var file = $file[0].files[0];
        	if (file) {
            	// getAsImage(file);            	
            	$.when(getImageUrlByFile(file))
            		.done(function (){
            			prepareCropImg(selectedImgUrl);
            			guideToCropImgArea();
            			makeCropImgDragable();
            			
            			//trigger change:tick
	        			$imageArea.trigger('change:tick');
            		});
            	
        	}
    	});
	}

	function initChangeBtn (){
		$changeImageBtn.click(function (e) {
			//guide to select & upload image
	        $changeImageBtn.addClass('ets-none');
	        $progressScreen.addClass('ets-none');
	        $cropScreen.addClass('ets-none');

	        $galleryScreen.removeClass('ets-none');
	        $uploadBtn.removeClass('ets-none ets-disabled');
	        $imageArea.removeClass('ets-valid');
	        
	        //trigger change:tick
	        $imageArea.trigger('change:tick');

	        //clean crop setting
	        $previewImage.draggable('destroy').css({
	            width: 'auto',
	            height: 'auto',
	            left: 0,
	            top: 0,
	            cursor: 'default'
	        });
    	});
	}

	//image wall control logic
	var $editProfleBtn = $('#edit-profile');
    function initImageEditBtn(){
    	    $editProfleBtn.click(function (e) {
		        //trigger eidt user discribe and image
		        $('#next-step').trigger('change:edit');
		    });
    }


	//next button valid logic
	var $nextBtn = $('#next-step')
	var $wall = $('.ets-profile-wall');
	function initNextBtn (){
		//listen the custom event change:tick
		$describeArea.add($imageArea).bind('change:tick',function(e){
			if($describeArea.hasClass('ets-valid') && $imageArea.hasClass('ets-valid')){
				$nextBtn.removeClass('ets-disabled');
			}else{
				$nextBtn.addClass('ets-disabled');
			}
		});

		//bind next button logic
		$nextBtn.click(function (e) {
	        if ($(this).hasClass('ets-disabled')) {
	            return;
	        } else {
	            if (!$wall.hasClass('ets-none')) {
	                alert('Activity completed!')
	            } else {
	                goToProfileWall();
	            }
	            
	        }
	    })
		.bind('change:edit',function(e){
			$wall.addClass('ets-none');
        	$imageArea.add($describeArea).removeClass('ets-none');
		});

	    function goToProfileWall () {
	        $.Deferred(function (dfd) {
	            $('.ets-profile-me').children('a').find('img').attr('src', selectedImgUrl);
	            $('.ets-profile-me .ets-tooltip-content').children('p').eq(0).text(myDescribe);

	            dfd.resolve();
	        }).done(function () {
	            $wall.removeClass('ets-none');
	            $imageArea.add($describeArea).addClass('ets-none');	            
	        });
    	}
	}

	//init 
	!function(){
		initDescrArea();
		initSelectImage();
		initUploadBtn();
		initChangeBtn();
		initNextBtn();
		initImageEditBtn();
	}();
})