function appToast(toast) {
    app.showToast(toast);
};

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

function calculateMealPlan() {
    meal_plan_stats = {
        calories: Number($('#calories').val()),
        fat: Number($('#fat').val()),
        protein: Number($('#protein').val()),
        carb: Number($('#carb').val()),
        restrictions: {
            vegan: $('#vegan').is(':checked'),
            vegetarian: $('#vegetarian').is(':checked'),
            seafood: $('#seafood').is(':checked'),
            nuts: $('#nuts').is(':checked'),
            lactose: $('#lactose').is(':checked')
        }
    }

    all_meal_plans = JSON.parse(app.getAsset('all_meals.json'));

    all_valid_meals = [];

    all_meal_plans.forEach(meal_plan => {
        allergens = meal_plan[Object.keys(meal_plan)[0]].allergens
        contains_allergen = false;
        allergens.forEach(allergen => {
            if (meal_plan_stats.restrictions[allergen]) {
                contains_allergen = true;
            }
        });
        if (!contains_allergen) {
            all_valid_meals.push(meal_plan);
        }
    });

    // Get all permutations of valid meals

    // Generate an accuracy score for each permutation

    // Return the permutations in order of accuracy score

}

function setActivityLevel() {
    lvl = Number($('#activity').val());

    if (lvl > 5 || lvl < 1) {

        app.showToast('Activity Level Must Be Between 1 and 5');

        return;

    }

    settings = JSON.parse(app.getLocalFile('settings.json'));

    bmr = calculateBMR(settings.age, settings.height, settings.weight, lvl, settings.is_male).toFixed(2);

    $('#recommended').html(`<li>BMR: <span class="stat">${bmr}</span></li>
    <li>Recommended Fat: <span class="stat">${(bmr*0.2/9).toFixed(2)}g-${(bmr*0.35/9).toFixed(2)}g</span></li>
    <li>Recommended Protein: <span class="stat">${(bmr*0.1/4).toFixed(2)}g-${(bmr*0.35/4).toFixed(2)}g</span></li>
    <li>Recommended Carbs: <span class="stat">${(bmr*0.45/4).toFixed(2)}g-${(bmr*0.65/4).toFixed(2)}g</span></li>`);

}

function showCreateMealPlan() {

    settings = JSON.parse(app.getLocalFile('settings.json'));

    bmr = calculateBMR(settings.age, settings.height, settings.weight, 1, settings.is_male).toFixed(2);

    $('main').prepend(`<div class="modal">
        <div class="modal-content-create-plan">
            <h2>Create A Meal Plan<div class="close" onclick="closeModal()">✕</div></h2>

            <label for="activity">Activity Level: 1 (1-5)</label>
            <input type="number" name="activity" id="activity" class="input-number">

            <button onclick="setActivityLevel();">Apply</button>

            <ul id="recommended" class="stat-list">
                <li>BMR: <span class="stat">${bmr}</span></li>
                <li>Recommended Fat: <span class="stat">${(bmr*0.2/9).toFixed(2)}g-${(bmr*0.35/9).toFixed(2)}g</span></li>
                <li>Recommended Protein: <span class="stat">${(bmr*0.1/4).toFixed(2)}g-${(bmr*0.35/4).toFixed(2)}g</span></li>
                <li>Recommended Carbs: <span class="stat">${(bmr*0.45/4).toFixed(2)}g-${(bmr*0.65/4).toFixed(2)}g</span></li>
            </ul>

            <label for="calories">Desired Calories</label>
            <input type="number" name="calories" id="calories" class="input-number">

            <label for="fat">Desired Fat (grams)</label>
            <input type="number" name="fat" id="fat" class="input-number">

            <label for="protein">Desired Protein (grams)</label>
            <input type="number" name="protein" id="protein" class="input-number">

            <label for="carb">Desired Carbs (grams)</label>
            <input type="number" name="carb" id="carb" class="input-number">

            <h3>Dietary Restrictions</h3>

            <ul>
                <li><input type="checkbox" name="vegan" id="vegan"> Vegan</li>
                <li><input type="checkbox" name="vegetarian" id="vegetarian"> Vegetarian</li>
                <li><input type="checkbox" name="seafood" id="seafood"> Seafood</li>
                <li><input type="checkbox" name="nuts" id="nuts"> Nuts</li>
                <li><input type="checkbox" name="lactose" id="lactose"> Lactose</li>
            </ul>

            <button onclick="calculateMealPlan();">Calculate</button>

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