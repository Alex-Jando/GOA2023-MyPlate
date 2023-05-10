function appToast(toast) {
    app.showToast(toast);
};

function showCreateMealPlan() {

    bmr = 1600 // calculateBMR();

    $('main').prepend(`<div class="modal">
        <div class="modal-content-create-plan">
            <h2>Create A Meal Plan<div class="close" onclick="closeModal()">✕</div></h2>

            <label for="activity">Activity Level: 1 (1-5)</label>
            <input type="number" name="activity" id="activity" class="input-number">

            <button onclick="app.showToast('Feature Not Yet Implemented');">Apply</button>

            <ul id="recommended">
                <li>BMR: ${bmr}</li>
                <li>Recommended Fat: ${(bmr*0.2/9).toFixed(2)}g-${(bmr*0.35/9).toFixed(2)}g</li>
                <li>Recommended Protein: ${(bmr*0.1/4).toFixed(2)}g-${(bmr*0.35/4).toFixed(2)}g</li>
                <li>Recommended Carbs: ${(bmr*0.45/4).toFixed(2)}g-${(bmr*0.65/4).toFixed(2)}g</li>
            </ul>

            <label for="calories">Desired Calories</label>
            <input type="number" name="calories" id="calories" class="input-number">

            <label for="fat">Desired Fat (grams)</label>
            <input type="number" name="fat" id="fat" class="input-number">

            <label for="protein">Desired Protein</label>
            <input type="number" name="protein" id="protein" class="input-number">

            <label for="carb">Desired Carbs</label>
            <input type="number" name="carb" id="carb" class="input-number">

            <h3>Dietary Restrictions</h3>

            <ul>
                <li><input type="checkbox" name="vegan" id="vegan"> Vegan</li>
                <li><input type="checkbox" name="vegetarian" id="vegetarian"> Vegetarian</li>
                <li><input type="checkbox" name="seafood" id="seafood"> Seafood</li>
                <li><input type="checkbox" name="nuts" id="nuts"> Nuts</li>
                <li><input type="checkbox" name="lactose" id="lactose"> Lactose</li>
            </ul>

            <button onclick="app.showToast('Feature Not Yet Implemented');">Calculate</button>

        </div>
    </div>`);
}

function showMealPlan(meal_plan_name) {

    meal_plans = JSON.parse(app.getLocalFile('meal_plans.json'));

    meal_plans = {}

    meal_plan_modal = `<div class="modal"><div class="modal-content-show-plan"><h2>${meal_plan_name}<div class="close" onclick="closeModal()">✕</div></h2><div class="divider"></div>`;

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