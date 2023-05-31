function closeModal() {

    $('.modal').remove();
    
};

function scheduleMealPlanSubmit() {
    mealPlanName = $('#mealPlanName').val();
    date = $('#date').val();

    meal_plans = JSON.parse(app.getLocalFile('meal_plans.json'));

    exists = false;

    Object.keys(meal_plans).forEach(meal_plan_name => {
        if (meal_plan_name == mealPlanName) {
            exists = true;
            return;
        }
    });

    if (!exists) {
        app.showToast('Meal plan does not exist!');
        return;
    }

    [date, time] = date.split('T');

    [year, month, day] = date.split('-');

    [hour, minute] = time.split(':');

    date = new Date(year, month - 1, day, hour, minute);

    calendar = JSON.parse(app.getLocalFile('calendar.json'));

    calendar[date.getTime()] = mealPlanName;

    app.saveLocalFile(JSON.stringify(calendar), 'calendar.json');

    closeModal();

    app.showToast('Meal Plan Scheduled!');

    window.location.href = '/assets/calendar.html';
}

function scheduleMealPlan() {

    $('main').prepend(`
    <div class="modal">
        <form class="modal-content-schedule-meal-plan" onsubmit="scheduleMealPlanSubmit(); return false;">
            <h2>Schedule Meal Plan<div class="close" onclick="closeModal()">✕</div></h2>
            <h3>Meal Plan Name:</h3>
            <input type="text" placeholder="Meal Plan Name" id="mealPlanName" class="input-text">
            <h3>Date:</h3>
            <input type="datetime-local" id="date" class="input-text">
            <button type="button" onclick="scheduleMealPlanSubmit();" class="button">Schedule</button>
        </form>
    </div>
    `)
}

$(function(){

    if (!app.hasNotificationPermission()) {

        app.requestNotificationPermission();

        if (!app.hasNotificationPermission()) {

            app.showToast('Please enable notifications to use the calendar.');

        }

        window.location.href = '/assets/index.html';

    }


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

    calendar = JSON.parse(app.getLocalFile('calendar.json'));

    schedules = '';

    Object.keys(calendar).forEach(key => {

        if (new Date(parseInt(key)) < Date.now()) {
            delete calendar[key];
            return;
        }

        schedules += `
        <div class="scheduled-meal">
            <h3>${calendar[key]}</h3>
            <p>${new Date(parseInt(key)).toLocaleString()}</p>
        </div>`;
    });

    app.saveLocalFile(JSON.stringify(calendar), 'calendar.json');

    $('main').prepend(schedules)

});