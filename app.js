// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWQ5ykFJv6xW0LQ54nYyKT0DmcbOR0_zg",
  authDomain: "bloodtestresult-a0982.firebaseapp.com",
  databaseURL: "https://bloodtestresult-a0982-default-rtdb.firebaseio.com",
  projectId: "bloodtestresult-a0982",
  storageBucket: "bloodtestresult-a0982.appspot.com",
  messagingSenderId: "580571381047",
  appId: "1:580571381047:web:87828d070eea01511caeb2",
  measurementId: "G-VJJD2ZGMCT"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Get a reference to the database
const database = firebase.database();

// Fetch donor data from the database
let donorData = [];

database.ref('donors').once('value')
  .then((snapshot) => {
    // Get the donor data from the snapshot
    donorData = Object.values(snapshot.val() || {});

    // Handle the search form submission
    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', handleSearch);

    // Handle the donor registration form submission
    const donorForm = document.getElementById('donor-form');
    donorForm.addEventListener('submit', handleDonorRegistration);
  })
  .catch((error) => {
    console.error('Error fetching donor data:', error);
  });

// Function to handle search form submission
function handleSearch(event) {
  event.preventDefault();
  const selectedBloodGroup = document.getElementById('blood-group').value;
  const filteredDonors = filterDonorsByBloodGroup(selectedBloodGroup);
  renderSearchResults(filteredDonors);
}

// Function to filter donors by blood group
function filterDonorsByBloodGroup(bloodGroup) {
  return donorData.filter((donor) => donor.bloodGroup === bloodGroup);
}

// Function to render search results
function renderSearchResults(donors) {
  const searchResultsContainer = document.getElementById('search-results');
  searchResultsContainer.innerHTML = '';

  if (donors.length === 0) {
    const noResultsMessage = document.createElement('p');
    noResultsMessage.textContent = 'No donors found for the selected blood group.';
    searchResultsContainer.appendChild(noResultsMessage);
  } else {
    donors.forEach((donor) => {
      const donorCard = createDonorCard(donor);
      searchResultsContainer.appendChild(donorCard);
    });
  }
}

// Function to create a donor card element
function createDonorCard(donor) {
  const card = document.createElement('div');
  card.className = 'donor-card';

  const nameElement = document.createElement('h3');
  nameElement.textContent = donor.name;
  card.appendChild(nameElement);

  const ageElement = document.createElement('p');
  ageElement.textContent = `Age: ${donor.age}`;
  card.appendChild(ageElement);

  const bloodGroupElement = document.createElement('p');
  bloodGroupElement.textContent = `Blood Group: ${donor.bloodGroup}`;
  card.appendChild(bloodGroupElement);

  const addressElement = document.createElement('p');
  addressElement.textContent = `Address: ${donor.address}`;
  card.appendChild(addressElement);

  const phoneElement = document.createElement('p');
  phoneElement.textContent = `Phone: ${donor.phone}`;
  card.appendChild(phoneElement);

  return card;
}

// Function to handle donor registration form submission
function handleDonorRegistration(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const donorData = {
    name: formData.get('name'),
    age: formData.get('age'),
    bloodGroup: formData.get('blood-group'),
    address: formData.get('address'),
    phone: formData.get('phone'),
  };

  // Push the donor data to the database
  database.ref('donors').push(donorData)
    .then(() => {
      console.log('Donor data saved successfully');
      // Clear the form or show a success message
      event.target.reset();
      alert('Donor data submitted successfully!');
    })
    .catch((error) => {
      console.error('Error saving donor data:', error);
      // Show an error message
      alert('Error submitting donor data. Please try again.');
    });
}