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

function getCombinations(sourceArray, comboLength) {
    const sourceLength = sourceArray.length;
    if (comboLength > sourceLength) return [];
  
    const combos = [];
  
    const makeNextCombos = (workingCombo, currentIndex, remainingCount) => {
      const oneAwayFromComboLength = remainingCount == 1;
  
      for (let sourceIndex = currentIndex; sourceIndex < sourceLength; sourceIndex++) {
        const next = [ ...workingCombo, sourceArray[sourceIndex] ];
  
        if (oneAwayFromComboLength) {
          combos.push(next);
        }
        else {
          makeNextCombos(next, sourceIndex + 1, remainingCount - 1);
        }
          }
    }
  
    makeNextCombos([], 0, comboLength);
    return combos;
  }

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
            lactose: $('#lactose').is(':checked'),
            celiac: $('#celiac').is(':checked'),
            halal: $('#halal').is(':checked'),
            kosher: $('#kosher').is(':checked')
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

    all_valid_meal_plans = getCombinations(all_valid_meals, 3);

    all_valid_meal_plans_accuracy = {};

    all_valid_meal_plans.forEach(meal_plan => {

        total_cals = 0;
        total_fat = 0;
        total_protein = 0;
        total_carb = 0;

        accuracy = 0;

        meal_plan.forEach(meal => {
            total_cals += meal[Object.keys(meal)[0]].calories
            total_fat += meal[Object.keys(meal)[0]].fat
            total_protein += meal[Object.keys(meal)[0]].protein
            total_carb += meal[Object.keys(meal)[0]].carbs
        });

        cals_acc = 1 - Math.abs(meal_plan_stats.calories - total_cals) / meal_plan_stats.calories;
        fat_acc = 1 - Math.abs(meal_plan_stats.fat - total_fat) / meal_plan_stats.fat;
        protein_acc = 1 - Math.abs(meal_plan_stats.protein - total_protein) / meal_plan_stats.protein;
        carb_acc = 1 - Math.abs(meal_plan_stats.carb - total_carb) / meal_plan_stats.carb;

        accuracy = (cals_acc + fat_acc + protein_acc + carb_acc) / 4;

        all_valid_meal_plans_accuracy[JSON.stringify(meal_plan)] = accuracy;

    });

    all_valid_meal_plans_accuracy_sorted = Object.keys(all_valid_meal_plans_accuracy);

    all_valid_meal_plans_accuracy_sorted.sort((a, b) => {
        return all_valid_meal_plans_accuracy[b] - all_valid_meal_plans_accuracy[a];
    });

    function previousMeal() {

        all_valid_meal_plans_accuracy_sorted = all_valid_meal_plans_accuracy_sorted;

        all_valid_meal_plans_accuracy = all_valid_meal_plans_accuracy;

        meal_index = Number($('#meal').attr('data-index'));

        if (meal_index <= 0) {
            meal_index = all_valid_meal_plans_accuracy_sorted.length - 1;
        } else {
            meal_index -= 1;
        }

        $('#meal').attr('data-index', meal_index);

        meal_plan = JSON.parse(all_valid_meal_plans_accuracy_sorted[meal_index]);

        meal_plan_data = `<h3>Accuracy: ${(all_valid_meal_plans_accuracy[JSON.stringify(meal_plan)] * 100).toFixed(2)}%</h3><p>`;
        nutritionals = {'calories': 0, 'protein': 0, 'fat': 0};
        meal_names = [];
        meal_plan.forEach(meal => {
            nutritionals.calories += meal[Object.keys(meal)[0]].calories;
            nutritionals.protein += meal[Object.keys(meal)[0]].protein;
            nutritionals.fat += meal[Object.keys(meal)[0]].fat;
            meal_names.push(Object.keys(meal)[0]);
        });

        meal_plan_data += meal_names.join(', ') + '.</p><div class="nutrition">';

        meal_plan_data += `<div class="nutritional"><div style="--color: green;" class="circle"></div>${Math.round(nutritionals.protein * 10) / 10}g Protein</div>`;

        meal_plan_data += `<div class="nutritional"><div style="--color: yellow;" class="circle"></div>${Math.round(nutritionals.fat * 10) / 10}g Fat</div>`;

        meal_plan_data += `<div class="nutritional"><div style="--color: red;" class="circle"></div>${Math.round(nutritionals.calories)} Calories</div>`;

        meal_plan_data += '</div></div>';

        $('#meal').html(meal_plan_data);

    }

    function nextMeal() {

        all_valid_meal_plans_accuracy_sorted = all_valid_meal_plans_accuracy_sorted;

        all_valid_meal_plans_accuracy = all_valid_meal_plans_accuracy;

        meal_index = Number($('#meal').attr('data-index'));

        if (meal_index >= all_valid_meal_plans_accuracy_sorted.length - 1) {
            meal_index = 0;
        } else {
            meal_index += 1;
        }

        $('#meal').attr('data-index', meal_index);

        meal_plan = JSON.parse(all_valid_meal_plans_accuracy_sorted[meal_index]);

        meal_plan_data = `<h3>Accuracy: ${(all_valid_meal_plans_accuracy[JSON.stringify(meal_plan)] * 100).toFixed(2)}%</h3><p>`;
        nutritionals = {'calories': 0, 'protein': 0, 'fat': 0};
        meal_names = [];
        meal_plan.forEach(meal => {
            nutritionals.calories += meal[Object.keys(meal)[0]].calories;
            nutritionals.protein += meal[Object.keys(meal)[0]].protein;
            nutritionals.fat += meal[Object.keys(meal)[0]].fat;
            meal_names.push(Object.keys(meal)[0]);
        });

        meal_plan_data += meal_names.join(', ') + '.</p><div class="nutrition">';

        meal_plan_data += `<div class="nutritional"><div style="--color: green;" class="circle"></div>${Math.round(nutritionals.protein * 10) / 10}g Protein</div>`;

        meal_plan_data += `<div class="nutritional"><div style="--color: yellow;" class="circle"></div>${Math.round(nutritionals.fat * 10) / 10}g Fat</div>`;

        meal_plan_data += `<div class="nutritional"><div style="--color: red;" class="circle"></div>${Math.round(nutritionals.calories)} Calories</div>`;

        meal_plan_data += '</div></div>';

        $('#meal').html(meal_plan_data);
    }

    function chooseMeal() {

        all_valid_meal_plans_accuracy_sorted = all_valid_meal_plans_accuracy_sorted;

        meal_plan = JSON.parse(all_valid_meal_plans_accuracy_sorted[Number($('#meal').attr('data-index'))]);

        current_meal_plans = JSON.parse(app.getLocalFile('meal_plans.json'));

        current_meal_plans[$('#mealPlanName').val()] = meal_plan;

        app.saveLocalFile(JSON.stringify(current_meal_plans), 'meal_plans.json');

        app.showToast('Meal Plan Saved');

        window.location.href = '/assets/index.html';

    }

    closeModal();

    meal_plan = JSON.parse(all_valid_meal_plans_accuracy_sorted[0]);

    meal_plan_div = `<div class="meal-plan" id="meal" data-index="0"><h3>Accuracy: ${(all_valid_meal_plans_accuracy[JSON.stringify(meal_plan)] * 100).toFixed(2)}%</h3><p>`;
    nutritionals = {'calories': 0, 'protein': 0, 'fat': 0};
    meal_names = [];
    meal_plan.forEach(meal => {
        nutritionals.calories += meal[Object.keys(meal)[0]].calories;
        nutritionals.protein += meal[Object.keys(meal)[0]].protein;
        nutritionals.fat += meal[Object.keys(meal)[0]].fat;
        meal_names.push(Object.keys(meal)[0]);
    });

    meal_plan_div += meal_names.join(', ') + '.</p><div class="nutrition">';

    meal_plan_div += `<div class="nutritional"><div style="--color: green;" class="circle"></div>${Math.round(nutritionals.protein * 10) / 10}g Protein</div>`;

    meal_plan_div += `<div class="nutritional"><div style="--color: yellow;" class="circle"></div>${Math.round(nutritionals.fat * 10) / 10}g Fat</div>`;

    meal_plan_div += `<div class="nutritional"><div style="--color: red;" class="circle"></div>${Math.round(nutritionals.calories)} Calories</div>`;

    meal_plan_div += '</div></div>';


    $('main').prepend(`<div class="modal">
        <div class="modal-content-create-plan">
            <h2>Choose A Meal Plan<div class="close" onclick="closeModal()">✕</div></h2>
                ${meal_plan_div}
            <div class="buttons">
                <input type="text" id="mealPlanName" class="input-text" value="New Meal Plan">
                <button id="prevMeal">Previous</button>
                <button id="chooseMeal">Choose</button>
                <button id="nextMeal">Next</button>
            </div>
        </div>
    </div>`);

    $('#prevMeal').click(() => {
        previousMeal();
    });

    $('#nextMeal').click(() => {
        nextMeal();
    });

    $('#chooseMeal').click(() => {
        chooseMeal();
    });

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

    $('#activity-label').html(`Activity Level: ${lvl} (1-5)`);

}

function showCreateMealPlan() {

    settings = JSON.parse(app.getLocalFile('settings.json'));

    bmr = calculateBMR(settings.age, settings.height, settings.weight, 1, settings.is_male).toFixed(2);

    $('main').prepend(`<div class="modal">
        <div class="modal-content-create-plan">
            <h2>Create A Meal Plan<div class="close" onclick="closeModal()">✕</div></h2>

            <form onsubmit="setActivityLevel(); return false;">

                <label for="activity" id="activity-label">Activity Level: 1 (1-5)</label>
                <input type="number" name="activity" id="activity" class="input-number">

                <button onclick="setActivityLevel();" type="button">Apply</button>

            </form>

            <ul id="recommended" class="stat-list">
                <li>BMR: <span class="stat">${bmr}</span></li>
                <li>Recommended Fat: <span class="stat">${(bmr*0.2/9).toFixed(2)}g-${(bmr*0.35/9).toFixed(2)}g</span></li>
                <li>Recommended Protein: <span class="stat">${(bmr*0.1/4).toFixed(2)}g-${(bmr*0.35/4).toFixed(2)}g</span></li>
                <li>Recommended Carbs: <span class="stat">${(bmr*0.45/4).toFixed(2)}g-${(bmr*0.65/4).toFixed(2)}g</span></li>
            </ul>

            <form onsubmit="calculateMealPlan(); return false;">

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
                    <li><input type="checkbox" name="celiac" id="celiac"> Celiac</li>
                    <li><input type="checkbox" name="halal" id="halal"> Halal</li>
                    <li><input type="checkbox" name="kosher" id="kosher"> Kosher</li>
                </ul>

                <button onclick="calculateMealPlan();" type="button">Calculate</button>

            </form>

        </div>
    </div>`);
}

function showMealPlan(meal_plan_name) {

    meal_plans = JSON.parse(app.getLocalFile('meal_plans.json'));

    meal_plan_modal = `<div class="modal"><div class="modal-content-show-plan"><h2>${meal_plan_name}<div class="close" onclick="closeModal()">✕</div></h2><div class="divider"></div>`;

    // <li>Cost: $${meal[Object.keys(meal)[0]].cost}</li>
    // <li>Time: ${meal[Object.keys(meal)[0]].time} minutes</li>

    meal_plans[meal_plan_name].forEach(meal => {
        ingredients = '';
        meal[Object.keys(meal)[0]].ingredients.forEach(ingredient => {
            ingredients += `<li>${ingredient}</li>`
        })
        meal_plan_modal += `<h3>${Object.keys(meal)[0]}</h3><ul>
        <li>Calories: ${meal[Object.keys(meal)[0]].calories}</li>
        <li>Protein: ${meal[Object.keys(meal)[0]].protein}g</li>
        <li>Fat: ${meal[Object.keys(meal)[0]].fat}g</li>
        <li>Carbs: ${meal[Object.keys(meal)[0]].carbs}g</li>
        </ul>
        <h4>Recipe:</h4>
        <p>${meal[Object.keys(meal)[0]].recipe}</p>
        <h4>Ingredients:</h4>
        <ul>
            ${ingredients}
        </ul>
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