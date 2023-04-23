$(function(){

    touchstartX = 0;
    touchendX = 0;
        
    function checkDirection() {
        if ((touchendX - touchstartX) < -50) window.location.href = '/assets/settings.html';
        if ((touchendX - touchstartX) > 50) window.location.href = '/assets/calculator.html';
    }

    $('main').on('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
    })

    $('main').on('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        checkDirection();
    })

});