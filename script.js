const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

// Event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
  mealDetailsContent.parentElement.classList.remove('active');
});

// Get meal list that matches ingredients
async function getMealList() {
  let searchInputTxt = document.getElementById('search-input').value.trim();
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`);
  const data = await response.json();
  displayMealList(data.meals);
}

// Display meal list
function displayMealList(meals) {
  let html = "";
  if (meals) {
    meals.forEach(meal => {
      html += `
        <div class="meal-item" data-id="${meal.idMeal}">
          <div class="meal-img">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          </div>
          <div class="meal-name">
            <h3>${meal.strMeal}</h3>
            <button class="recipe-btn">Get Recipe</button>
          </div>
        </div>
      `;
    });
  } else {
    html = "No meals found for your ingredient! Please try again.";
  }
  mealList.innerHTML = html;
}

// Get recipe of the meal
async function getMealRecipe(e) {
  if (e.target.classList.contains('recipe-btn')) {
    const mealItem = e.target.parentElement.parentElement;
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`);
    const data = await response.json();
    showRecipeDetails(data.meals[0]);
  }
}

// Show recipe details
function showRecipeDetails(meal) {
  let ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    } else {
      break;
    }
  }

  const html = `
    <div class="recipe-meal-img">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    </div>
    <h2 class="recipe-title">${meal.strMeal}</h2>
    <div class="recipe-category">${meal.strCategory}</div>
    <div class="recipe-instructions">
      <h3>Instructions:</h3>
      <p>${meal.strInstructions}</p>
    </div>
    <div class="recipe-ingredients">
      <h3>Ingredients:</h3>
      ${ingredients.map(ing => `<p>${ing}</p>`).join('')}
    </div>
    <div class="recipe-link">
      <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
    </div>
  `;
  
  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add('active');
}