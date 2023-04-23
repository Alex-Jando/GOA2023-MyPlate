function appToast(toast) {
    app.showToast(toast);
};

function loadMeals(){
    meal_plans = JSON.parse(app.getAsset('meal_plans.json'));

    Object.keys(meal_plans).forEach(meal_plan_name => {
        meal_plan_div = `<div class="meal-plan"><h3>${meal_plan_name}</h3><p>`;
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
        
    function checkDirection() {
        if ((touchendX - touchstartX) < -50) window.location.href = '/assets/calculator.html';
    }

    $('main').on('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
    })

    $('main').on('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        checkDirection();
    })

    loadMeals();
});