$(function () {
    var $galleryScreen = $('.ets-gallery');
    var $progressScreen = $('.ets-progress-wrapper')
    var $cropScreen = $('.ets-crop-area');

    var $imageLib = $galleryScreen.find('li a');

    var $describeArea = $('.ets-describe-area');
    var $describe = $('#input-describe');
    var $counter = $describeArea.find('.ets-helper strong');
    var $imageArea = $('.ets-select-image-area');
    var $previewImage = $cropScreen.find('img');
    var $wall = $('.ets-profile-wall');

    var $uploadBtn = $('#upload-image');
    var $changeImageBtn = $('#change-image')
    var $nextBtn = $('#next-step');
    var $editProfleBtn = $('#edit-profile');
    var $file = $('input:file');

    var completeActivity = false;

    var selectImgUrl;
    var myDescribe;

    var previewWidth = 328;
    var previewHeight = 292;

    window.progressBar = new Image();
    progressBar.src = "img/progress-bar.png";

    $describeArea.add($imageArea).bind('change:tick', function (e) {
        if ($describeArea.hasClass('ets-valid') && $imageArea.hasClass('ets-valid')) {
            $nextBtn.removeClass('ets-disabled');
        } else {
            $nextBtn.addClass('ets-disabled');
        }
    });

    $imageLib.click(function (e) {
        e.preventDefault();

        selectImgUrl = $(this).find('img').attr('src');

        $galleryScreen.addClass('ets-none');
        $progressScreen.addClass('ets-none');
        $cropScreen.removeClass('ets-none');

        $uploadBtn.addClass('ets-none');
        $changeImageBtn.removeClass('ets-none');

        $imageArea.addClass('ets-valid');
        $imageArea.trigger('change:tick');

        $previewImage.attr("src", selectImgUrl)
        .css({
            width: previewWidth,
            height: previewHeight
        });

    });

    // textarea stuff
    $describe.bind('input', function (e) {
        var val = $.trim($describe.val());

        if (val) {
            $describeArea.addClass('ets-valid');
            $describeArea.trigger('change:tick')
        } else {
            $describeArea.removeClass('ets-valid');
            $describeArea.trigger('change:tick')
        }

        myDescribe = val;
    }).focus(function (e) {
        var val = $.trim($describe.val());
        $('.ets-placeholder').hide();

    }).blur(function (e) {
        var val = $.trim($describe.val());
        if (!val.length) {
            $('.ets-placeholder').show();
        }
    });

    $describe.counter({
        goal: 250
    });

    // upload image
    $uploadBtn.click(function (e) {
        if ($uploadBtn.hasClass('ets-disabled')) {
            return;
        }
        $file.trigger('click');
    });

    $file.change(function (e) {
        var file = $file[0].files[0];

        if (file) {
            getAsImage(file);
        }
    });

    function getAsImage(readFile) {
        var reader = new FileReader();

        reader.readAsDataURL(readFile);

        reader.onprogress = updateProgress;
        reader.onload = loaded;
        reader.onerror = errorHandler;
    }

    function updateProgress(e) {
        $uploadBtn.addClass('ets-disabled');
        $galleryScreen.addClass('ets-none');
        $progressScreen.removeClass('ets-none'); 
    }

    function loaded (e) {
        var imgUrl = e.target.result;

        var image = new Image();
        selectImgUrl = image.src = imgUrl;

        $(image).load(function () {
            $previewImage.attr("src", imgUrl).css("cursor", 'move');

            $galleryScreen.addClass('ets-none');
            $progressScreen.addClass('ets-none');
            $cropScreen.removeClass('ets-none');

            $uploadBtn.addClass('ets-none');
            $changeImageBtn.removeClass('ets-none');

            $imageArea.addClass('ets-valid');
            $imageArea.trigger('change:tick');


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

            delete image;
        });

       
    }

    function errorHandler (e) {
        console.log(e);
    }

    $changeImageBtn.click(function (e) {
        $galleryScreen.removeClass('ets-none');
        $progressScreen.addClass('ets-none');
        $cropScreen.addClass('ets-none');

        $uploadBtn.removeClass('ets-none ets-disabled');
        $changeImageBtn.addClass('ets-none');

        $imageArea.removeClass('ets-valid');
        $imageArea.trigger('change:tick');

        $previewImage.draggable('destroy').css({
            width: 'auto',
            height: 'auto',
            left: 0,
            top: 0,
            cursor: 'default'
        });;
    });

    $nextBtn.click(function (e) {
        if ($(this).hasClass('ets-disabled')) {
            return;
        } else {
            if (completeActivity) {
                alert('Activity completed!')
            } else {
                goToProfileWall();
            }
            
        }
    });

    $editProfleBtn.click(function (e) {
        goToImageArea();
    });

    function goToProfileWall () {
        $.Deferred(function (dfd) {
            $('.ets-profile-me').children('a').find('img').attr('src', selectImgUrl);
            $('.ets-profile-me .ets-tooltip-content').children('p:eq(0)').text(myDescribe);

            dfd.resolve();
        }).done(function () {
            $wall.removeClass('ets-none');
            $imageArea.add($describeArea).addClass('ets-none');
            completeActivity = true;
        });
    }

    function goToImageArea() {
        $wall.addClass('ets-none');
        $imageArea.add($describeArea).removeClass('ets-none');
        completeActivity = false;
    }
});