const API_KEY = 'AIzaSyCsGHBHtSxJwCKxPbMdh9qimR_d9JLEUDM'; // Replace with your API Key
const SEARCH_ENGINE_ID = '06eb64568ca8e4fc5'; // Replace with your Search Engine ID
const ENDPOINT = 'https://www.googleapis.com/customsearch/v1';
const RESULTS_PER_PAGE = 10;

let currentPage = 1;

document.getElementById('searchButton').addEventListener('click', () => {
  currentPage = 1; // Reset to the first page
  performSearch();
});

async function performSearch() {
  const query = document.getElementById('searchInput').value.trim();
  const resultsDiv = document.getElementById('results');
  const paginationDiv = document.getElementById('pagination');

  if (query === '') {
    resultsDiv.innerHTML = '<p>Please enter a search query.</p>';
    return;
  }

  resultsDiv.innerHTML = '<p>Searching...</p>';
  paginationDiv.innerHTML = '';

  try {
    const startIndex = (currentPage - 1) * RESULTS_PER_PAGE + 1;
    const response = await fetch(
      `${ENDPOINT}?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(
        query
      )}&start=${startIndex}`
    );

    if (!response.ok) throw new Error('Error fetching results');

    const data = await response.json();
    const results = data.items || [];

    if (results.length === 0) {
      resultsDiv.innerHTML = '<p>No results found.</p>';
      return;
    }

    resultsDiv.innerHTML = results
      .map(
        result =>
          `<div class="result"><a href="${result.link}" target="_blank">${result.title}</a><br>${result.snippet}</div>`
      )
      .join('');

    const totalResults = parseInt(data.searchInformation.totalResults, 10);
    createPagination(totalResults);
  } catch (error) {
    console.error(error);
    resultsDiv.innerHTML = '<p>Error fetching search results. Try again later.</p>';
  }
}

function createPagination(totalResults) {
  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);
  const paginationDiv = document.getElementById('pagination');
  paginationDiv.innerHTML = '';

  for (let i = 1; i <= totalPages && i <= 10; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.className = 'pagination-button';
    if (i === currentPage) button.disabled = true;

    button.addEventListener('click', () => {
      currentPage = i;
      performSearch();
    });

    paginationDiv.appendChild(button);
  }
}
