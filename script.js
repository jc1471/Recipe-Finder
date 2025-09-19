//console.log("Working");

// ---------- Define Variables -----------//

const textInput = document.getElementById("search-input");
const submitBtn = document.getElementById("submit-btn");
const form = document.querySelector("#search-form");

let keywordsArray = [];

async function searchRecipes() {
  try {
    console.log("Started function");
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${keywordsArray[0]}`
    );
    console.log("Started fetch");
    const resultsArray = await response.json();
    console.log("Results: ", resultsArray);
  } catch (error) {
    console.log("Error: ", error);
  }
}

// Form input handler
form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("Input: ", textInput.value);

  // Parse user input, separate keywords and psuh to array
  keywordsArray.push(textInput.value.split(" "));
  console.log("Keywords Array: ", keywordsArray);

  searchRecipes();
});
