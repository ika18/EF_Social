// detect web cam available or not
function webcamAvailable () {
	// console.log('available');
	deleteDetection();
}

function noWebcamAvailable() {
	// console.log('no');
	deleteDetection();
	
	$('#soc_profile_setup .soc_pu_btn:eq(1)').remove();
	$('#soc_profile_setup .soc_pu_btn:eq(0)').css({
		'padding-top': 88
	});
}
function deleteDetection () {
	$("#soc_profile_setup").removeClass('soc_detecting').addClass('soc_tooltip_show')
	.find('.soc_tooltip').addClass('intro');
}

$(function () {
	var $profiles = $('#soc_profiles'),
    $plBox = $('.soc_pl_img_box'),
    $profileSetup = $('#soc_profile_setup'),
    $webcamBtn = $('#soc_profile_setup .soc_pu_btn:eq(1)'),
    $profileListItem = $('#soc_profile_list li'),
    $progressBar = $("#soc_uploading_bar"),
    $fullViewImg = $("#soc_profile_fullview img");
    $imgPreview = $('#soc_img_preview');

	var showProgressBar = function () {
		//show progress bar
        $profileSetup.addClass('soc_profile_upload');
        $progressBar.pb({ speed: 300 }).loopAnimation();
	};

	var uploadErrorHandler = function () {
		$profileSetup.removeClass().addClass('soc_tooltip_show').find('.soc_tooltip').addClass('soc_tooltip_error');
        $('#error_step p').text("An unexpected error occurred, please try it later!");
	};

	var parseTemplate = function (template) {
		var parsed = Mustache.render(template, viewData);

		$('#soc_profile_list').html(parsed);
	};


	var onFileUploadChange = function (e) {
		var file = $(this)[0].files[0];

		readImage(file);
	};

	var readImage = function (file) {
		var reader = new FileReader();
		var limitedSize = 400;

		// on load start, show progress
		reader.onloadstart = function (e) {
			$profileSetup.addClass('soc_profile_upload');
            $progressBar.pb({ speed: 300 }).loopAnimation();
		};

		// on load show img preview
		reader.onload = function (e) {
			var imgUrl = e.target.result;

			var img = new Image();
			img.src = imgUrl;
			var dfd = $.Deferred();
			var imgLoaded = function (dfd) {
				img.onload = function () {
					dfd.resolve();
				};
				return dfd;
			};

			$.when(imgLoaded(dfd)).done(function () {
				var imgWidth = img.width;
				var imgHeigth = img.height;
				var previewWidth, previewHeigth;
				
				if (imgHeigth >= imgWidth) {
					if (imgHeigth > limitedSize) {
						previewHeigth = limitedSize;
						previewWidth = (imgWidth / imgHeigth) * previewHeigth;
					} else {
						previewHeigth = imgHeigth;
						previewWidth = imgWidth;
					}
				} else if (imgHeigth < imgWidth) {
					if (imgWidth > limitedSize) {
						previewWidth = limitedSize;
						previewHeigth = (imgHeigth / imgWidth) * previewWidth;
					} else {
						previewHeigth = imgHeigth;
						previewWidth = imgWidth;
					}
				}
				
				
				$imgPreview.add($fullViewImg).attr({
					src: imgUrl,
					width: previewWidth,
					height: previewHeigth
				});

				showUploadImage();

				positionImages(previewWidth, previewHeigth);
			});
			

		};

		reader.readAsDataURL(file);
	}
	

	var showUploadImage = function () {
		$progressBar.killAnimation();

		$profileSetup.removeClass('soc_profile_upload')
    	.addClass('soc_profile_review').addClass('soc_tooltip_show')
    	.find('textarea').focus();

        $("#soc_profile_fullview").show();
	};

	var bindProfileEvents = function () {
		var clickHandler = function (e) {
			e.preventDefault();
			var $me = $(this);
			var $root = $me.parent();
			$root.addClass('soc_tooltip_show');
			
			$me.off('click');

			setTimeout(function () {
				$(window).on('click', function (e) {

					if (!$(e.target).closest($root.find('soc_tooltip')).length) {
						$root.removeClass('soc_tooltip_show');
						$(this).off(e);

						setTimeout(function () {
							$me.on('click', clickHandler);
						}, 100);
					}
				});
			}, 100);
		};

		$('.soc_pl_img_box').on('click', clickHandler);
	};
	

	var positionImages = function (width, height) {
		var $fullviewContainer = $("#soc_profile_fullview"),
	    $draggableContainer = $("#soc_my_profile");

		if ($fullViewImg.length) {
            $fullViewImg.css({
                left: ($fullviewContainer.width() - width) / 2,
                top: ($fullviewContainer.height() - height) / 2
            });
        }

        $imgPreview.css({
            left: ($draggableContainer.width() - width) / 2,
            top: ($draggableContainer.height() - height) / 2
        });

        cropProfileImage($fullViewImg, $imgPreview);
	};

	var cropProfileImage = function ($fullViewImg, $draggableImg) {
		var $fullViewImg = $fullViewImg,
		fullViewImgLeft,
		fullViewImgTop;
        $draggableImg.draggable({
            cursor: 'move',
            start: function () {
                if ($fullViewImg.length) {
                    fullViewImgLeft = $fullViewImg.position().left;
                    fullViewImgTop = $fullViewImg.position().top;
                }
            },
            drag: function (e, ui) {
                var position = ui.position,
			originalPosition = ui.originalPosition,
			minLeft = 240 - $(this).width(),
			minTop = 240 - $(this).height();

                if (position.left > 0) {
                    position.left = 0;
                }
                if (position.top > 0) {
                    position.top = 0;
                }
                if (position.left < minLeft) {
                    position.left = minLeft;
                }
                if (position.top < minTop) {
                    position.top = minTop;
                }

                $fullViewImg.css({
                    left: fullViewImgLeft - (originalPosition.left - position.left),
                    top: fullViewImgTop - (originalPosition.top - position.top)
                });
            }
        }).css('cursor', 'move');
	};

	var closeProfileFullview = function () {
        $('#soc_profile_fullview').hide();
    };

    var DescriptionValidation = function () {
        var count = $("#desc_count");
        var description = $("#description").textareaValidate({
            minlimit: 15,
            maxlimit: 300,
            textChanged: function (vdata) {
                //todo change the button style
                count.text(vdata.maxlimit - vdata.length);
            }
        }).focus(function () {
            $(this).css('borderColor', '#009CFF')
        });

        return description.validate().result;
    };


	//load template
	$.get('templates/profile-list.html').done(function (res) {
		parseTemplate(res);
		bindProfileEvents();
		DescriptionValidation();
	}).fail(function () {
		alert('Load template error!');
	});

	$(window).on('click', function (e) {
		var $me = $(e.target);
		var $soc_tooltip = $('#soc_profile_setup .soc_tooltip');
		if (!$me.closest($soc_tooltip).length) {
			$soc_tooltip.removeClass('intro');
			$profileSetup.removeClass('soc_tooltip_show');
			$(this).off(e);
		}
	});

	// bind reupload image button
	$('#reupload').click(function (e) {
		e.stopPropagation();
        e.preventDefault();
        $profileSetup.removeClass();
        $profileSetup.addClass('soc_detecting');
        closeProfileFullview();
	});

	// upload profile 
	$("#fileupload").bind('change', onFileUploadChange);

	// create my profile
	$('#create').click(function (e) {
		e.preventDefault();

		if (!DescriptionValidation()) {
			var $description = $('#description');
			// TODO: add error tip animate
            return;
        }
        var description = $.trim($('#description').val());
        var $this = $(this);

        // if the description is not empty then create it
        if (description.length > 0) {
        	$this.parents('.soc_tooltip').addClass('review').find('#review_step p').text(description);

            closeProfileFullview();
            $('#soc_my_profile img').draggable("destroy").css('cursor', 'pointer');
            
            $('#soc_my_profile').addClass('edit');

        }
	});
});
