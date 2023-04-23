function appToast(toast) {
    app.showToast(toast);
};

function loadMeals(){
    meal_plans = JSON.parse(app.getAsset('meal_plans.json'));

    Object.keys(meal_plans).forEach(meal_plan_name => {
        meal_plan_div = `<div class="meal-plan"><h3>${meal_plan_name}</h3><p>`;
        meal_plan_nutritionals = {};
        meal_names = [];
        meal_plans[meal_plan_name].forEach(meal => {
            meal_plan_nutritionals.calories += meal.calories;
            meal_plan_nutritionals.carbs += meal.carbs;
            meal_plan_nutritionals.protein += meal.protein;
            meal_plan_nutritionals.fat += meal.fat;
            meal_plan_nutritionals.cost += meal.cost;
            meal_plan_nutritionals.time += meal.time;
            meal_names.push(Object.keys(meal)[0]);
        });

        meal_plan_div += meal_names.join(', ') + '.</p><div class="nutrition">';

        Object.keys(meal_plan_nutritionals).forEach(nutritional => {
            meal_plan_div += `<div class="nutritional"><div class="circle" style="--color: red"></div>${nutritional}: ${meal_plan_nutritionals[nutritional]}g</div>`
        });

        $('main').prepend(meal_plan_div);
    });
};

$(function(){
    loadMeals();
});