let travelData;

// Cargar los datos del JSON
fetch('./travel_recommendation_api.json')
  .then(response => response.json())
  .then(data => {
    travelData = data;
    console.log('Datos cargados correctamente:', travelData);
  })
  .catch(error => console.error('Error al cargar los datos:', error));

const searchInput = document.getElementById('conditionInput');
const searchButton = document.getElementById('searchButton');
const resetButton = document.getElementById('resetButton');
const destinationInfoContainer = document.getElementById('destination_info');

function searchDestination() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  if (!searchTerm) return;

  destinationInfoContainer.innerHTML = '';
  let results = [];

  // Búsquedas específicas por palabra clave
  if (searchTerm === 'beach') {
    results = travelData.beaches;
  } else if (searchTerm === 'temple') {
    results = travelData.temples;
  } else if (searchTerm === 'country') {
    travelData.countries.forEach(country => {
      results.push(...country.cities);
    });
  } else {
    // Búsqueda general (por nombre en países, ciudades, templos, playas)
    travelData.countries.forEach(country => {
      if (country.name.toLowerCase().includes(searchTerm)) {
        results.push(...country.cities);
      }
      country.cities.forEach(city => {
        if (city.name.toLowerCase().includes(searchTerm)) {
          results.push(city);
        }
      });
    });

    travelData.temples.forEach(temple => {
      if (temple.name.toLowerCase().includes(searchTerm)) {
        results.push(temple);
      }
    });

    travelData.beaches.forEach(beach => {
      if (beach.name.toLowerCase().includes(searchTerm)) {
        results.push(beach);
      }
    });
  }

  // Mostrar resultados
  if (results.length > 0) {
    results.forEach(result => displayDestination(result));
  } else {
    destinationInfoContainer.innerHTML = `
      <h2 style="color: white;">No se encontraron resultados</h2><br><br>
      <p style="color: white;">Intenta con otra búsqueda.</p>
    `;
  }
}

function displayDestination(destination) {
  const destinationCard = document.createElement('div');
  destinationCard.className = 'destination-card';

  destinationCard.innerHTML = `
    <div class="destination-image">
      <img src="img/cities/${destination.imageUrl}" alt="${destination.name}">
    </div>
    <div class="destination-info">
      <h2>${destination.name}</h2>
      <p>${destination.description}</p>
      <button class="visit-btn">Visitar</button>
    </div>
  `;

  destinationInfoContainer.appendChild(destinationCard);
}

function resetSearch() {
  searchInput.value = '';
  destinationInfoContainer.innerHTML = '';
}

searchButton.addEventListener('click', searchDestination);
resetButton.addEventListener('click', resetSearch);
searchInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    searchDestination();
  }
});
