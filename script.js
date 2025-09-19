// ---------- Define Variables -----------//

const textInput = document.getElementById("search-input");
const submitBtn = document.getElementById("submit-btn");
const form = document.querySelector("#search-form");
const formBlock = document.querySelector("div.search");
const cardContainer = document.createElement("div");

let keywordsArray = [];

// urls for get requests
const searchByKeyword = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const searchByCategory =
  "https://www.themealdb.com/api/json/v1/1/filter.php?c=";
const searchByRandom = "www.themealdb.com/api/json/v1/1/random.php";

// ----------Define Functions ------------//

// Fetch function that can be called for x items in array
async function fetchAndParse(url) {
  const response = await fetch(url);
  // Throw an error for bad responses (4xx or 5xx)
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
}

// Fetch multiple APIs
async function searchRecipesByKeywords() {
  try {
    console.log("started function");
    const apiCalls = await Promise.allSettled(
      keywordsArray.map((keyword) => {
        console.log("Fetching keyword: ", keyword);
        return fetchAndParse(`${searchByKeyword}${keyword}`);
      })
    );

    const resultsArray = [];

    // Loop through each keyword search result to check if successful
    apiCalls.forEach((result) => {
      console.log(`${result} status: ${result.status}`);
      console.log(`${result} value: ${result.value.meals}`);
      if (result.status === "fulfilled" && result.value.meals) {
        // Loop through each meal result and push to results array
        result.value.meals.forEach((meal) => {
          // Can add functionality to check that meal name contains
          // all keywords, instead of any keyword

          // Check that meal is not already inside array
          if (!resultsArray.some((m) => m.idMeal === meal.idMeal)) {
            resultsArray.push(meal);
            console.log(`${meal.strMeal} added to results array`);
          }
        });
      } else {
        console.log("No results found");
      }
    });
    console.log("Results Array: ", resultsArray);
    return resultsArray;
  } catch (error) {
    console.log("Error: ", error);
  }
}

function renderCard(meal) {
  console.log(`${meal.strMeal} card created`);
  // render p elements with text content taking from meal object
  const card = document.createElement("div");
  card.classList.add("card");
  const name = document.createElement("p");
  name.textContent = meal.strMeal;
  card.appendChild(name);

  const flag = document.createElement("span");
  flag.textContent = meal.strArea;
  card.appendChild(flag);

  // Append to parent
  cardContainer.appendChild(card);
}

// ---------- Run Program ----------------- //

// Form input handler
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  console.log("Input: ", textInput.value);

  // Parse user input, separate keywords and psuh to array
  keywordsArray.push(...textInput.value.split(" "));
  console.log("Keywords Array: ", keywordsArray);

  const mealsArray = await searchRecipesByKeywords();
  console.log("Meals array looks like this: ", mealsArray);

  // Show Results Section

  // Hide form and show reset button
  const resetBtn = document.createElement("button");
  resetBtn.textContent = "New Search";
  formBlock.appendChild(resetBtn);
  form.style.display = "none";

  // Create a div with grid functionality

  cardContainer.classList.add("card-container");
  formBlock.after(cardContainer);
  // Loop through results array to create cards
  mealsArray.forEach((meal) => {
    renderCard(meal);
  });
});
