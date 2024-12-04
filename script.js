// DOM Elements
const countriesContainer = document.getElementById('countries-container');
const searchInput = document.getElementById('search');
const themeToggle = document.getElementById('theme-toggle');
const favoritesToggle = document.getElementById('favorites-toggle');
const favoritesModal = document.getElementById('favorites-modal');
const favoritesClose = document.querySelector('.close');
const favoritesList = document.getElementById('favorites-list');

let countries = [];
let favorites = JSON.parse(localStorage.getItem('favoriteCountries')) || [];

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.classList.toggle('light-mode', savedTheme === 'light');
  themeToggle.textContent = savedTheme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  const theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
  localStorage.setItem('theme', theme);
  themeToggle.textContent = theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
});

// Favorites Management
function toggleFavorite(country) {
  const index = favorites.findIndex(fav => fav.code === country.code);
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(country);
  }
  localStorage.setItem('favoriteCountries', JSON.stringify(favorites));
  renderFavorites();
  displayCountries(countries);
}

function renderFavorites() {
  favoritesModal.style.display = 'none';
  favoritesList.innerHTML = '';
  
  if (favorites.length === 0) {
    favoritesList.innerHTML = '<p>No favorite countries yet!</p>';
    return;
  }

  favorites.forEach(country => {
    const favItem = document.createElement('div');
    favItem.classList.add('favorite-item');
    favItem.innerHTML = `
      <img src="https://flagcdn.com/w320/${country.code.toLowerCase()}.png" alt="${country.name} flag">
      <span>${country.name}</span>
      <button onclick="toggleFavorite(${JSON.stringify(country).replace(/"/g, '&quot;')})">Remove</button>
    `;
    favoritesList.appendChild(favItem);
  });
}

favoritesToggle.addEventListener('click', () => {
  renderFavorites();
  favoritesModal.style.display = 'block';
});

favoritesClose.addEventListener('click', () => {
  favoritesModal.style.display = 'none';
});

// Fetch and Display Countries
async function fetchCountries() {
  try {
    const response = await fetch('data.json');
    countries = await response.json();
    
    // Shuffle countries randomly
    countries.sort(() => Math.random() - 0.5);
    
    displayCountries(countries);
    setupSearch(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
  }
}

function displayCountries(displayCountries) {
  countriesContainer.innerHTML = '';
  displayCountries.forEach(country => {
    const card = document.createElement('div');
    card.classList.add('country-card');
    
    const isFavorite = favorites.some(fav => fav.code === country.code);
    
    const flagUrl = `https://flagcdn.com/w320/${country.code.toLowerCase()}.png`;
    
    card.innerHTML = `
      <img src="${flagUrl}" alt="${country.name} flag">
      <div class="country-details">
        <h2>${country.name}</h2>
        <p><strong>Capital:</strong> ${country.capital}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Currency:</strong> ${country.currency.name} (${country.currency.symbol})</p>
        <p><strong>Language:</strong> ${country.language.name}</p>
        <p><strong>Dialling Code:</strong> ${country.dialling_code}</p>
        <button class="favorite-btn ${isFavorite ? 'favorited' : ''}" 
          onclick='toggleFavorite(${JSON.stringify(country).replace(/"/g, '&quot;')})'>
          ${isFavorite ? '❤️ Unfavorite' : '🤍 Favorite'}
        </button>
      </div>
    `;
    
    countriesContainer.appendChild(card);
  });
}

// Search Functionality
function setupSearch(countriesData) {
  searchInput.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    const filteredCountries = countriesData.filter(country =>
      country.name.toLowerCase().includes(query) ||
      country.region.toLowerCase().includes(query)
    );
    displayCountries(filteredCountries);
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  fetchCountries();
});