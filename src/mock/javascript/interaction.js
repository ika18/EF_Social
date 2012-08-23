$(function () {
    var $galleryScreen = $('.ets-gallery');
    var $progressScreen = $('.ets-progress-wrapper')
    var $cropScreen = $('.ets-crop-area');

    var $describeArea = $('.ets-describe-area');
    var $describe = $('#input-describe');
    var $counter = $describeArea.find('.ets-helper strong');
    var $imageArea = $('.ets-select-image-area');
    var $progressBar = $('.ets-progress-track')

    var $uploadBtn = $('#upload-image');
    var $changeImageBtn = $('#change-image')
    var $nextBtn = $('#next-step');
    var $file = $('input:file');


    $describeArea.add($imageArea).bind('change:tick', function (e) {
        if ($describeArea.hasClass('ets-valid') && $imageArea.hasClass('ets-valid')) {
            $nextBtn.removeClass('ets-disabled');
        } else {
            $nextBtn.addClass('ets-disabled');
        }
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
    }).focus(function (e) {
        var val = $.trim($describe.val());
        if (val == $describe.attr('data-placeholder')) {
            $describe.val('');
            $describe.removeClass('ets-placeholder');
        }
    }).blur(function (e) {
        var val = $.trim($describe.val());
        if (!val) {
            $describe.addClass('ets-placeholder');
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
        // console.log();
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

        $progressBar.pb({
            speed: 300
        }).loopAnimation();   
    }

    function loaded (e) {
        var imgUrl = e.target.result;
        var $image = $cropScreen.find('img');

        var image = new Image();
        image.src = imgUrl;

        $(image).load(function () {
            $image.attr("src", imgUrl);

            $galleryScreen.addClass('ets-none');
            $progressScreen.addClass('ets-none');
            $cropScreen.removeClass('ets-none');

            $uploadBtn.addClass('ets-none');
            $changeImageBtn.removeClass('ets-none');

            $imageArea.addClass('ets-valid');
            $imageArea.trigger('change:tick');

            var width = $image.width() - 328;
            var height = $image.height() - 292;

            $image.draggable({
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
    });

    $nextBtn.click(function (e) {
        if ($(this).hasClass('ets-disabled')) {
            return;
        } else {
            goToProfileWall();
        }
    });

    function goToProfileWall () {
        
    }
});