function calculateBMR(age, height, weight, pal, is_male) {

    bmr = 0;
    tee = 0;

    if (is_male) {

        bmr = 10 * weight + 6.25 * height - 5 * age + 5

        switch (pal) {
            case(1):
                tee = bmr * 1.2;
                break;
            
            case(2):
                tee = bmr * 1.375;
                break;
            case(3): 
                tee = bmr * 1.55;
                break;
            case(4):
                tee = bmr * 1.725;
                break;
            case(5):
                tee = bmr * 1.9;
                break;
            default:
                tee = bmr;
                break;
        }

    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
        switch (pal) {
        case(1):
            tee = bmr * 1.2;
            break;
        
        case(2):
            tee = bmr * 1.375;
            break;
        case(3):
            tee = bmr * 1.55;
            break;
        case(4):
            tee = bmr * 1.725;
            break;
        case(5):
            tee = bmr * 1.9;
            break;
        default:
            
        }
    }

    return tee;
    
};

function calculateBMI(height, weight) {

    return weight / ((height / 100) * (height / 100));

};

function calculateBFP(height, weight, age) {
    return 1.2 * calculateBMI(height, weight) + 0.23 * age - 16.2;
};

function calculateBLP(height, weight, age) {
    return 100 - calculateBFP(height, weight, age);
}

function calculateMP(height, weight, age) {
    switch (true) {
        case (age <= 35):
            return 0.42 * calculateBLP(height, weight, age);
        case (age <= 55):
            return 0.38 * calculateBLP(height, weight, age);
        case (age <= 75):
            return 0.33 * calculateBLP(height, weight, age);
        default:
            return 0.31 * calculateBLP(height, weight, age);
    }
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

    settings = JSON.parse(app.getLocalFile('settings.json'));

    $('#bmr-1').html(`Activity Level 1: ${calculateBMR(settings.age, settings.height, settings.weight, 1, settings.is_male).toFixed(2)} kcal`)
    $('#bmr-2').html(`Activity Level 2: ${calculateBMR(settings.age, settings.height, settings.weight, 2, settings.is_male).toFixed(2)} kcal`)
    $('#bmr-3').html(`Activity Level 3: ${calculateBMR(settings.age, settings.height, settings.weight, 3, settings.is_male).toFixed(2)} kcal`)
    $('#bmr-4').html(`Activity Level 4: ${calculateBMR(settings.age, settings.height, settings.weight, 4, settings.is_male).toFixed(2)} kcal`)
    $('#bmr-5').html(`Activity Level 5: ${calculateBMR(settings.age, settings.height, settings.weight, 5, settings.is_male).toFixed(2)} kcal`)

    $('#bmi-val').html(`Body Mass Index: ${calculateBMI(settings.height, settings.weight).toFixed(2)}`)

    $('#blp-val').html(`Lean Percentage: ${(calculateBLP(settings.height, settings.weight, settings.age)).toFixed(2)}%`)

    $('#bfp-val').html(`Body Fat Percentage: ${(calculateBFP(settings.height, settings.weight, settings.age)).toFixed(2)}%`)

    $('#mp-val').html(`Muscle Percentage: ${(calculateMP(settings.height, settings.weight, settings.age)).toFixed(2)}%`)

});