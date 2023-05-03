function saveSettings() {

    if (!($('#age-input').val() || $('#height-input').val() || $('#weight-input').val())) {
        return app.showToast('Please fill in all fields!');
    }

    settings = {};
    settings.age = Number($('#age-input').val());
    settings.height = Number($('#height-input').val());
    settings.weight = Number($('#weight-input').val());
    settings.is_male = $('#gender-input').is(':checked');
    app.saveLocalFile(JSON.stringify(settings), 'settings.json');

    $('input').val('');

    loadSettings();

    app.showToast('Settings saved!');

}

function loadSettings() {

    settings = JSON.parse(app.getLocalFile('settings.json'));

    $('#age-label').html(`Age (years): ${settings.age}`);
    $('#height-label').html(`Height (cm): ${settings.height}`);
    $('#weight-label').html(`Weight (kg): ${settings.weight}`);
    if (settings.is_male) {
        $('#gender-label').html(`Gender: Male`);
    } else {
        $('#gender-label').html(`Gender: Female`);
        $('#gender-input').attr('checked', false);
    }

    $('#age-input').val(settings.age);
    $('#height-input').val(settings.height);
    $('#weight-input').val(settings.weight);

}

$(function(){

    loadSettings();

    touchstartX = 0;
    touchendX = 0;
    touchstartY = 0;
    touchendY = 0;
        
    function checkDirection() {
        if ((touchendX - touchstartX) > 50 && -50 < (touchendY - touchstartY) &&  50 > (touchendY - touchstartY)) window.location.href = '/assets/calendar.html';
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