const API_URL = "http://localhost:3000/api";

const searchForm = document.getElementById("search-form");
const queryInput = document.getElementById("query");
const loadingIndicator = document.getElementById("loading");
const resultsDiv = document.getElementById("results");
const recommendationDiv = document.getElementById("recommendation");
const errorMessageDiv = document.getElementById("error-message");

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault(); 

  const query = queryInput.value.trim();
  if (!query) {
    errorMessageDiv.textContent = "Please enter a query.";
    errorMessageDiv.classList.remove("hidden");
    resultsDiv.classList.add("hidden"); 
    return;
  }

  loadingIndicator.classList.remove("hidden");
  resultsDiv.classList.add("hidden");
  recommendationDiv.textContent = ""; 
  errorMessageDiv.classList.add("hidden"); 

  try {
    const response = await fetch(`${API_URL}/recommend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Failed to get recommendations. Please check the console." }));
      throw new Error(errorData.message || "Failed to get recommendations");
    }

    const data = await response.json();

    recommendationDiv.textContent = data.message;
    resultsDiv.classList.remove("hidden");
  } catch (error) {
    console.error("Error:", error);
    errorMessageDiv.textContent = error.message || "Failed to get recommendations. Please try again.";
    errorMessageDiv.classList.remove("hidden");
  } finally {
    loadingIndicator.classList.add("hidden");
  }
});
