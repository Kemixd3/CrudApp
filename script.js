"use strict";


var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("myHeader").style.top = "0";
  } else {
    document.getElementById("myHeader").style.top = "-150px"; // Hide the header when scrolling down
  }
  prevScrollpos = currentScrollPos;
}




//Initialize Firebase realtime database
var firebaseConfig = {
  apiKey: "AIzaSyBuWPU0zqYMOcDZqhBj6lYhJ1Clo8hoFfI",
  authDomain: "javascriptgame-4e4c9.firebaseapp.com",
  databaseURL: "https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "javascriptgame-4e4c9",
  storageBucket: "javascriptgame-4e4c9.appspot.com",
  messagingSenderId: "929889109178",
  appId: "1:929889109178:web:b4b41c9bf29de88d7c6e83",
  measurementId: "G-P40H8CJHRK"
};
firebase.initializeApp(firebaseConfig);

//Get a reference to the database service
var database = firebase.database();




//Handle form submission
function addPokemon() {
  //Get form values from the form
  var name = document.getElementById("name").value;
  var productLink = document.getElementById("productLink").value;

  var link = document.getElementById("link").value;

  var normalPris = document.getElementById("normalPris").value;
  var tilbudsPris = document.getElementById("tilbudsPris").value;
  
  //Push product data to the database

  const url = 'https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app/product.json';
  
  const data = {
    name: name,
    normalPris: normalPris,
    link: link,
    productLink: productLink,
    tilbudsPris: tilbudsPris
  };
  
  const options = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  fetch(url, options)
    .then(response => response.json())
    .then(data => console.log('New product added:', data))
    .catch(error => console.error('Error adding new product:', error));

  
  //Clear form fields
  // <textarea id="normalPris" name="normalPris" required></textarea><br>
  document.getElementById("name").value = "";
  document.getElementById("normalPris").value = "";
  document.getElementById("link").value = "";
  document.getElementById("productLink").value = "";
  document.getElementById("tilbudsPris").value = "";


}

  

const pokemonForm = document.getElementById('pokemon-form');

//Call toggleForm to minimize the form initially
toggleForm(pokemonForm);


function toggleForm() {
  const form = document.getElementById("pokemon-form");
  const minimizeButton = document.getElementById("minimize-form");
  if (form.style.display === "none") {
    form.style.display = "block";
    minimizeButton.innerHTML = "Minimize";
  } else {
    form.style.display = "none";
    minimizeButton.innerHTML = "Tilføj nyt tilbud";
  }
}








var searchInput = document.getElementById("search");
var resultsDiv = document.getElementById("results");

// Attach a keyup event listener to the search input
searchInput.addEventListener("input", function() {
  var searchTerm = searchInput.value;
  document.addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
      fetch("https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app/product.json?orderBy=\"name\"")
      .then(response => response.json())
      .then(data => {
        // Clear previous results
        resultsDiv.innerHTML = "";
  
        // Display the results
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            if (data[key].name.toLowerCase().includes(searchTerm.toLowerCase())) {
              console.log(data[key]);
              var card = document.createElement("div");
              card.innerHTML = "<h3>" + data[key].name + "</h3>" +
                               "<img src='" + data[key].productLink + "' alt='" + data[key].name + "'>" +
                               "<p></p>";
              resultsDiv.appendChild(card);
            }
          }
        }
      })
      .catch(error => console.error(error));
    }
  });
  





  // Get the search term



});




//Update pokemon data function
function updatePokemon(id, name, productLink, normalPris, link, tilbudsPris) {
  fetch('https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app/product/' + id + '.json', {
    method: 'PUT',
    body: JSON.stringify({
      name: name,
      productLink: productLink,
      normalPris: normalPris,
      link: link,
      tilbudsPris: tilbudsPris,
    }),
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
}



//Delete pokemon data function using id
function deletePokemon(id) {
  fetch('https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app/product/' + id + '.json', {
    method: 'DELETE'
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Pokemon successfully deleted:', data);
  })
  .catch(error => {
    console.error('There was a problem deleting the Pokemon:', error);
  });
}


//Display pokemon cards and dialog (NOT REST CALL)
var pokemonCards = document.getElementById("pokemon-cards");
database.ref('product').on('child_added', function(data) {
  var pokemon = data.val();
  var card = document.createElement("div");
  card.className = "pokemon-card";
  card.id = "card-" + data.key;
  card.innerHTML = "<h2>" + "Produkt navn:" + " " + pokemon.name + "</h2>";
  
  if (pokemon.link.includes("http")) {
    card.innerHTML += "<img src='" + pokemon.link + "'>";
  }
  
  card.innerHTML += "<button style='float: right;' class='view-more-btn'>Se mere</button>";
  var button = card.querySelector('.view-more-btn');
  button.style.position = "absolute";
  button.style.bottom = "10px"; 
  button.style.right = "10px";
  card.style.position = "relative";
  
  pokemonCards.appendChild(card);
  var dialog = document.createElement("dialog");
  dialog.innerHTML = "<p>Normalpris: " + pokemon.normalPris + "</p>" +
  "<p>Tilbudspris: " + pokemon.tilbudsPris + "</p>";
  

  database.ref('product').on('child_removed', function(data) {
    var pokemonCard = document.getElementById("card-" + data.key);
    if (pokemonCard != null) {
      pokemonCard.remove();
    }
  });
  
  
  if (!pokemon.productLink.includes("http")) {
    console.log("issue")
    dialog.innerHTML += "<h2>" + "Linket til produktsiden er ugyldigt" + "" + "</a>" + "</h2>";
  } else {
    dialog.innerHTML += "<h2>" + "Link til produkt siden" + " " + "<a href='" + pokemon.productLink + "' target='_blank'>" + "Her" + "</a>" + "</h2>";
    console.log("No issue")
    
  }
  


  
  
  dialog.innerHTML += "<button class='editBtn' onclick='editPokemon(\"" + data.key + "\", \"" + pokemon.name + "\", \"" + pokemon.productLink + "\", \"" + pokemon.normalPris + "\", \"" + pokemon.link + "\", \"" + pokemon.tilbudsPris + "\")' style='cursor: pointer; background-color: #ffcb05; color: #333; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin-right: 10px; border: none; border-radius: 5px;'>Opdater</button>" +
"<button onclick='deletePokemon(\"" + data.key + "\")' style=' cursor: pointer; background-color: #f44336; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin-right: 10px; border: none; border-radius: 5px;'>Slet tilbud</button>" +
"<button class='close-dialog-btn' style=' cursor: pointer; background-color: #ccc; color: #333; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border: none; border-radius: 5px;'>Luk</button>";
 ;
  dialog.id = "dialog-" + data.key;
  card.appendChild(dialog);
  

  var updateMaximize = card.querySelector('.editBtn');
  updateMaximize.addEventListener('click', function() {
    console.log("TEST")
    toggleForm(pokemonForm);
  });


  var viewMoreBtn = card.querySelector('.view-more-btn');
  viewMoreBtn.addEventListener('click', function() {
    var dialog = document.querySelector("#dialog-" + data.key);
    dialog.showModal();
  });
  var closeDialogBtn = dialog.querySelector(".close-dialog-btn");
  closeDialogBtn.addEventListener("click", function() {
    dialog.close();
  });
});



//Edit pokemon data
function editPokemon(id, name, productLink, normalPris, link, tilbudsPris) {
  document.getElementById("name").value = name;

  document.getElementById("productLink").value = productLink;
  document.getElementById("normalPris").value = normalPris;
  document.getElementById("link").value = link;
  document.getElementById("tilbudsPris").value = tilbudsPris;




  document.getElementById('pokemon-add').style.visibility = 'hidden';
  var updateButton = document.getElementById("update-pokemon-button");
  updateButton.style.display = "block";
  updateButton.onclick = function() {
    updatePokemon(id, document.getElementById("name").value, document.getElementById("productLink").value, document.getElementById("normalPris").value, document.getElementById("link").value, document.getElementById("tilbudsPris").value);
    
    document.getElementById("add-pokemon-button").innerHTML = "Add Pokemon";
    document.getElementById("add-pokemon-button").onclick = addPokemon;
    document.getElementById("pokemon-form").reset();
  };
}


