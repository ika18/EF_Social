
function onFlashSnapshot() {
    $('#soc_profile_setup').addClass('soc_tooltip_show').find('textarea').focus();
    $('#soc_my_profile img').attr('src', 'server/php/snapshot/snapshot.jpg');
    $('#soc_profile_setup').removeClass('soc_profile_upload').addClass('soc_profile_review');
}

function webcamAvailable() {
	deleteDetection();
}

function noWebcamAvailable() {
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

function fakeUpload () {
	$('.fakeUpload .soc_btn').click(function () {
		$('.fakeUpload input[type="file"]').trigger('click');
		hideInitialPopup();
		return false;
	});
}

function snapShot () {
    $('#soc_profile_setup .soc_btn').eq(1).bind('click', function () {
	    $('#soc_profile_setup').addClass('soc_profile_snapshot');
	    hideInitialPopup()
	    return false;
	});
}

function bindUploadProcess () {
	// file upload
   	$('#fileupload').fileupload({
        dataType: 'json'
    });
	
	$('#fileupload').bind('fileuploadadd', function (e, data) { 
		//show progress bar
		$('#soc_profile_setup').addClass('soc_profile_upload');
	});
	
	// $('#fileupload').bind('fileuploadprogress', function (e, data) {
	// 	var progress = parseInt(data.loaded / data.total * 100, 10);
	// 	$('#soc_uploading p:eq(1) strong').text(progress);
	// 	$('#soc_uploading_bar').attr('value', progress);
	// });
	
	// $('#fileupload').bind('fileuploaddone', function (e, data) {
	// 	$('#soc_my_profile img').attr('src', data.result[0].thumbnail_url);
 //            $('#soc_profile_setup').removeClass('soc_profile_upload')
 //            .addClass('soc_profile_review').addClass('soc_tooltip_show')
 //            .find('textarea').focus();
	// });

}

function hideInitialPopup () {
	$('#soc_profile_setup').removeClass('soc_tooltip_show')
    .find('.soc_tooltip').removeClass('intro');
}

function bindClickPhotoList () {
	$('.soc_pl_img_box').click(function (e) {
		var $li = $(e.target).parents('li');
		$('#soc_profile_list li').removeClass('soc_tooltip_show');
		$li.toggleClass('soc_tooltip_show');

		$(document).bind("mousedown", function (e) {
            if (!$(e.target).closest($li).length) {
                $li.removeClass('soc_tooltip_show');
                $(this).unbind(e);
            }
        });

		return false;
	});
}

function createMyProfile () {
	$('#create').bind('click', function (e) {
		var description = $('#description').val();
		if (description.length > 0) {
			$(this).parents('.soc_tooltip').addClass('done').find('#review_step p').text(description);
		}

		return false;
	});

	// show profile setup tooltip
	$('#soc_my_profile a:eq(0)').bind('click', function (e) {
		$('#soc_profile_setup').addClass('soc_tooltip_show');
		return false;
	});
	// hide profile setup tooltip
	$(document).bind("mousedown", function (e) {
		var $setup = $('#soc_profile_setup'),
		$tooltip = $setup.find('.soc_tooltip');

        if (!$(e.target).closest($setup).length) {
        	if ($tooltip.hasClass('done')) {
        		$tooltip.removeClass('done').addClass('review');
        		$setup.removeClass('soc_tooltip_show');
        	}
        	else if ($tooltip.hasClass('review')) {
        		$setup.removeClass('soc_tooltip_show');
        	}
        	else if ($tooltip.hasClass('intro')) {
        		$setup.removeClass('soc_tooltip_show');
        		$tooltip.removeClass('intro');
        	}  
        }
    });

}

function reupload () {
	$('#reupload').bind('click', function (e) {
    	e.stopPropagation();
    	e.preventDefault();
    	$('#soc_profile_setup').removeClass().find('.soc_tooltip').removeClass('review').find('textarea').val('');

    	return false;
    });
}

$(function () {

	bindClickPhotoList();
	
	fakeUpload();

	snapShot();

	bindUploadProcess();
   
	createMyProfile();

	reupload();


	swfobject.embedSWF("cameraDetection.swf", "soc_detection", "240", "240", "9.0.0", "expressInstall.swf", {}, { quality:"high", allowscriptaccess:"always", wmode:"transparent" }, {} );
});
