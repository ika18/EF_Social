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
        }
    });
    
});