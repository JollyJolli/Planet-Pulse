// DOM Elements
const countriesContainer = document.getElementById('countries-container');
const searchInput = document.getElementById('search');

// Fetch data from the JSON file
async function fetchCountries() {
  try {
    const response = await fetch('data.json');
    const countries = await response.json();
    displayCountries(countries);
    setupSearch(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
  }
}

function displayCountries(countries) {
    countriesContainer.innerHTML = ''; // Clear container
    countries.forEach(country => {
      const card = document.createElement('div');
      card.classList.add('country-card');
  
      // Convert country code to lowercase for flag URL
      const flagUrl = `https://flagcdn.com/w320/${country.code.toLowerCase()}.png`;
  
      card.innerHTML = `
        <img src="${flagUrl}" alt="${country.name} flag">
        <h2>${country.name}</h2>
        <p><strong>Capital:</strong> ${country.capital}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Currency:</strong> ${country.currency.name} (${country.currency.symbol})</p>
        <p><strong>Language:</strong> ${country.language.name}</p>
        <p><strong>Dialling Code:</strong> ${country.dialling_code}</p>
      `;
  
      countriesContainer.appendChild(card);
    });
  }
  

// Set up search functionality
function setupSearch(countries) {
  searchInput.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    const filteredCountries = countries.filter(country =>
      country.name.toLowerCase().includes(query) ||
      country.region.toLowerCase().includes(query)
    );
    displayCountries(filteredCountries);
  });
}

// Initialize
fetchCountries();
