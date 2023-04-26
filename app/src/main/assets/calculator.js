function calculateBMR(age, height, weight, pal, is_male) {

    bmr = 0;
    tee = 0;

    if (is_male) {

        bmr = 66.5 + (13.75 * weight * 0.453592) + (5.003 * height) - (6.75 * age);

        switch (pal) {
            case(0):
                tee = bmr * 1.2;
                break;
            
            case(1 || 2):
                tee = bmr * 1.375;
                break;
            case(3 || 4 || 5):
                tee = bmr * 1.55;
                break;
            case(6 || 7):
                tee = bmr * 1.725;
                break;
            case(8):
                tee = bmr * 1.9;
                break;
            default:
                tee=1;
                break;
        }

    } else {

        bmr = 655.1 + (9.563 * weight * 0.453592) + (1.85 * height) - (4.676 * age);

        switch (pal) {
            case(0):
                tee = bmr * 1.2;
                break;
            
            case(1 || 2):
                tee = bmr * 1.375;
                break;
            case(3 || 4 || 5):
                tee = bmr * 1.55;
                break;
            case(6 || 7):
                tee = bmr * 1.725;
                break;
            case(8):
                tee = bmr * 1.9;
                break;
            
        }
    }

    return bmr;

};

function getBMR(){
    age = Number($('#age').val());
    height = Number($('#height').val());
    weight = Number($('#weight').val());
    pal = Number($('#pal').val());
    is_male = Boolean($('#is_male').val());

    bmr = calculateBMR(age, height, weight, pal, is_male);

    $('#result').html(`BMR: ${bmr}`)
}

$(function(){

    touchstartX = 0;
    touchendX = 0;
    touchstartY = 0;
    touchendY = 0;
        
    function checkDirection() {
        if ((touchendX - touchstartX) < -50 && -50 < (touchendY - touchstartY) &&  50 > (touchendY - touchstartY)) window.location.href = '/assets/calendar.html';
        if ((touchendX - touchstartX) > 50 && -50 < (touchendY - touchstartY) &&  50 > (touchendY - touchstartY)) window.location.href = '/assets/index.html';
    }

    $('main').on('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
        touchstartY = e.changedTouches[0].screenY;
    });

    $('main').on('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        touchendY = e.changedTouches[0].screenY;
        checkDirection();
    })



});