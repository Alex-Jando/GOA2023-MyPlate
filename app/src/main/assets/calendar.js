$(function(){

    touchstartX = 0;
    touchendX = 0;
    touchstartY = 0;
    touchendY = 0;
        
    function checkDirection() {
        if ((touchendX - touchstartX) < -50 && -50 < (touchendY - touchstartY) &&  50 > (touchendY - touchstartY)) window.location.href = '/assets/settings.html';
        if ((touchendX - touchstartX) > 50 && -50 < (touchendY - touchstartY) &&  50 > (touchendY - touchstartY)) window.location.href = '/assets/calculator.html';
    }

    $('main').on('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
        touchstartY = e.changedTouches[0].screenY;
    })

    $('main').on('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        touchendY = e.changedTouches[0].screenY;
        checkDirection();
    })

});