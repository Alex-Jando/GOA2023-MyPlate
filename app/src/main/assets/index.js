function appToast(toast) {
    app.showToast(toast);
};

function showMealPlan(meal_plan_name) {

    meal_plans = JSON.parse(app.getLocalFile('meal_plans.json'));

    meal_plan_modal = `<div class="modal"><div class="modal-content"><h2>${meal_plan_name}<div class="close" onclick="closeModal()">✕</div></h2><div class="divider"></div>`;

    meal_plans[meal_plan_name].forEach(meal => {
        meal_plan_modal += `<h3>${Object.keys(meal)[0]}</h3><ul>
        <li>Calories: ${meal[Object.keys(meal)[0]].calories}</li>
        <li>Protein: ${meal[Object.keys(meal)[0]].protein}g</li>
        <li>Fat: ${meal[Object.keys(meal)[0]].fat}g</li>
        <li>Carbs: ${meal[Object.keys(meal)[0]].carbs}g</li>
        <li>Cost: $${meal[Object.keys(meal)[0]].cost}</li>
        <li>Time: ${meal[Object.keys(meal)[0]].time} minutes</li>
        </ul>
        <h4>Recipe:</h4>
        <p>${meal[Object.keys(meal)[0]].recipe}</p>
        <div class="divider"></div>`;
    });

    $('main').prepend(meal_plan_modal + '</div></div>');
};

function closeModal() {

    $('.modal').remove();
    
};

function loadMeals(){
    meal_plans = JSON.parse(app.getLocalFile('meal_plans.json'));

    Object.keys(meal_plans).forEach(meal_plan_name => {
        meal_plan_div = `<div class="meal-plan" onclick="showMealPlan('${meal_plan_name}');"><h3>${meal_plan_name}</h3><p>`;
        nutritionals = {'calories': 0, 'protein': 0, 'fat': 0};
        meal_names = [];
        meal_plans[meal_plan_name].forEach(meal => {
            nutritionals.calories += Object.values(meal)[0].calories;
            nutritionals.protein += meal[Object.keys(meal)[0]].protein;
            nutritionals.fat += meal[Object.keys(meal)[0]].fat;
            meal_names.push(Object.keys(meal)[0]);
        });

        meal_plan_div += meal_names.join(', ') + '.</p><div class="nutrition">';

        meal_plan_div += `<div class="nutritional"><div style="--color: green;" class="circle"></div>${Math.round(nutritionals.protein * 10) / 10}g Protein</div>`;

        meal_plan_div += `<div class="nutritional"><div style="--color: yellow;" class="circle"></div>${Math.round(nutritionals.fat * 10) / 10}g Fat</div>`;

        meal_plan_div += `<div class="nutritional"><div style="--color: red;" class="circle"></div>${Math.round(nutritionals.calories)} Calories</div>`;

        meal_plan_div += '</div></div>';

        $('main').prepend(meal_plan_div);
    });
};

$(function(){

    touchstartX = 0;
    touchendX = 0;
    touchstartY = 0;
    touchendY = 0;
        
    function checkDirection() {
        if ((touchendX - touchstartX) < -50 && -50 < (touchendY - touchstartY) &&  50 > (touchendY - touchstartY)) window.location.href = '/assets/calculator.html';
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

    loadMeals();

});