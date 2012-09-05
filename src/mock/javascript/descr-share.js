$(function() {

	//Describe Area
    var checkTextLength = function(text, minLength) {
        if (typeof text === 'undefined') {
            return false;
        }
        if (typeof minLength === "undefined") {
            minLength = 0;
        }
        if (text.length > minLength) {
            return true;
        } else {
            return false;
        }
    };
        
    var $textPlaceHolder = $('.ets-placeholder');
    var $describeArea = $('.ets-describe-area');
    var $describe = $('#input-describe');
    var validText = function(text) {
        var val = $.trim($describe.val());
        if (checkTextLength(val)) {
            $textPlaceHolder.hide();
            $describeArea.addClass('ets-valid');
        } else {
            $textPlaceHolder.show();
            $describeArea.removeClass('ets-valid');
        }        
        $describeArea.trigger('change:tick');//TroopJs will use hub instead of this.
    };

    var warmTextLength = 240;    
    var warmingLackCharsLeft = function(){        
        var $LeftCharNumSpan = $('#input-describe_count');    
        var val = $.trim($describe.val());        
        if(val.length >= warmTextLength){
            console.log($LeftCharNumSpan);
            $LeftCharNumSpan.addClass('warmColor');
        }else{
            $LeftCharNumSpan.removeClass('warmColor');
        }
    }

    //Shared CheckBox Area
    function sharedWithOthers()  {

        var $sharedCheckBoxArea = $describeArea.find('.share-info');        
        $sharedCheckBoxArea.bind('hover', function (e) {
            if (e.type === "mouseenter") {
                $(this).addClass('share-info-hover');
            } else if (e.type === "mouseleave") {
                $(this).removeClass('share-info-hover');
            }
        });
    }

    var defaultMaxTextLength = 250;
    function initDescrArea() {
        //init textarea
        $describe.counter({
            goal: defaultMaxTextLength
        });

        //bind valid text event handler
        $describeArea.focusin(function(event) {
            $textPlaceHolder.hide();
        }).bind('keyup , focusout', function(e) {
            validText();
            warmingLackCharsLeft();
        });     

        //Shared with others
        sharedWithOthers();
    }


    //Image Area
    var previewWidth = 329;
    var previewHeight = 329;
    var $cropScreen = $('.ets-crop-area');
    var $previewImage = $cropScreen.find('img');
    var prepareCropImg = function(imgurl) {
        $previewImage.attr("src", imgurl);
    };    
    
    var guideToCropImgArea = function() {
        
        $imageArea.addClass('ets-selected-image ets-valid');
        $uploadBtn.addClass('ets-disabled');

        //trigger change:tick
        $imageArea.trigger('change:tick');
    };   
    
    var selectedImgUrl;
    var $imageArea = $('.ets-select-image-area');
    var $galleryScreen = $('.ets-gallery');
    var $imgLib = $galleryScreen.find('li a');
    var $progressScreen = $('.ets-progress-wrapper');
    var $cropScreen = $('.ets-crop-area');
    var $uploadBtn = $('#upload-image');
    var $changeImageBtn = $('#change-image');
    function initSelectImage() { 
        $imgLib.click(function(event) {            
            selectedImgUrl = $(this).find('img').attr('src');
            prepareCropImg(selectedImgUrl);     
            guideToCropImgArea();

            //fix current mock image to somall bug
            $previewImage.css({
                width: 298,
                height: 298
            });

            //block bubble and default handler
            return false;
        });
    }
    
    var makeCropImgDragable = function() {
    	//use dom can get real width and height ,jQuery can't
        var imgWidth = $previewImage[0].width;
        var imgHeight = $previewImage[0].height;
        
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
            drag: function(e, ui) {
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
            },
            cursor: "move"
        });
    }
    
    var getImageUrlByFile = function(dfd, file) {

        //prototype : use html5 filereader		
        var fileReader = new FileReader();
        fileReader.onload = function(e) {
            selectedImgUrl = e.target.result;
            dfd.resolve();
        };
        fileReader.onerror = function(e) {
        //action about error handler
        };
        fileReader.readAsDataURL(file);

    //rtm : use upload server
    //...
    };
    
    var $file = $('input:file');
    function initUploadBtn() {
        $uploadBtn.click(function(e) {
            if ($uploadBtn.hasClass('ets-disabled')) {
                return;
            }
            $file.trigger('click');
        });
        
        $file.change(function(e) {
            var file = $file[0].files[0];
            if (file) {
                // getAsImage(file);            	
                $.Deferred(function(d) {
                    getImageUrlByFile(d, file);
                }).done(function() {
                    prepareCropImg(selectedImgUrl);
                    makeCropImgDragable();
                    guideToCropImgArea();
                });            
            }
        });
    }
    
    var guideToSelectImgArea = function() {
        $previewImage.attr("src", '');
        $uploadBtn.removeClass('ets-disabled');
        $imageArea.removeClass('ets-selected-image ets-valid');
    };
    
    function initChangeBtn() {
        $changeImageBtn.click(function(e) {

            //guide to select & upload image
            guideToSelectImgArea();

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

    // function cropImageSetting(){    	
    //     $previewImage[0].onload = function(e,dfd) {
    //         makeCropImgDragable();          
    //     };
    // }

    //image wall control logic
    var $editProfleBtn = $('#edit-profile');
    function initImageEditBtn() {
        $editProfleBtn.click(function(e) {
            //trigger eidt user discribe and image
            $('#next-step').trigger('change:edit');
        });
    }


    //next button valid logic
    var $nextBtn = $('#next-step')
    var $wall = $('.ets-profile-wall');
    function initNextBtn() {
        //listen the custom event change:tick
        $describeArea.add($imageArea).bind('change:tick', function(e) {
            if ($describeArea.hasClass('ets-valid') && $imageArea.hasClass('ets-valid')) {
                $nextBtn.removeClass('ets-disabled');
            } else {
                $nextBtn.addClass('ets-disabled');
            }
        });

        //bind next button logic
        $nextBtn.click(function(e) {
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
        .bind('change:edit', function(e) {
            $wall.addClass('ets-none');
            $imageArea.add($describeArea).removeClass('ets-none');
        });
        
        function goToProfileWall() {
            $.Deferred(function(dfd) {
                $('.ets-profile-me').children('a').find('img').attr('src', selectedImgUrl);

                var myDescribe = $.trim($describe.val());
                $('.ets-profile-me .ets-tooltip-content').children('p').eq(0).text(myDescribe);
                
                dfd.resolve();
            }).done(function() {
                $wall.removeClass('ets-none');
                $imageArea.add($describeArea).addClass('ets-none');
            });
        }
    }

    //init 
    !function() {
        initDescrArea();        
        initSelectImage();
        initUploadBtn();
        initChangeBtn();
        initNextBtn();
        initImageEditBtn();
    }();
})
