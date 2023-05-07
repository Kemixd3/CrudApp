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
function addProduct() {
  //Get form values from the form
  var name = document.getElementById("name").value;
  var productLink = document.getElementById("productLink").value;

  var link = document.getElementById("link").value;

  var normalPris = document.getElementById("normalPris").value;
  var tilbudsPris = document.getElementById("tilbudsPris").value;
  var date = new Date();
  var options1 = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'Europe/Copenhagen' };
  var formattedDate = date.toLocaleString('da-DK', options1);
  
  //Push product data to the database

  const url = 'https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app/product.json';

  const data = {
    name: name,
    normalPris: normalPris,
    link: link,
    productLink: productLink,
    tilbudsPris: tilbudsPris,
    createdAt: formattedDate // Add current date to the data object
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

  

const productForm = document.getElementById('pokemon-form');

//Call toggleForm to minimize the form initially
toggleForm(productForm);


function toggleForm() {
  const form = document.getElementById("product-form");
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
            if (String(data[key].name).toLowerCase().includes(searchTerm.toLowerCase())) {
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




//Update product data function
function updateProduct(id, name, productLink, normalPris, link, tilbudsPris) {
  dialog.close();

}



//Delete product data function using id
function deleteProduct(id) {
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
    console.log('product successfully deleted:', data);
  })
  .catch(error => {
    console.error('There was a problem deleting the product:', error);
  });
}


//Display product cards and dialog (NOT REST CALL)
var productCards = document.getElementById("product-cards");
database.ref('product').on('child_added', function(data) {
  var product = data.val();
  var card = document.createElement("div");
  card.className = "product-card";
  card.id = "card-" + data.key;
  card.innerHTML = "<h1 style='text-align: center;'>" + product.name + "</h1>";
  if (product.link && product.link.includes("http")) {
    card.innerHTML += "<img src='" + product.link + "'>";
  }

  card.innerHTML += "<h3 style='text-align: center;'>Pris: <span style='text-decoration: line-through; color: grey;'>" + product.normalPris + "</span> <strong>" + product.tilbudsPris +"</strong></h3>";
  card.innerHTML += "<p>" + "Oprettet:" + " " + product.createdAt + "</p>";
  card.innerHTML += "<button style='width: 30%; display: block; margin: 0 auto;' class='view-more-btn'>Se mere</button>";

  var button = card.querySelector('.view-more-btn');
  button.style.textAlign = "center";
  
  productCards.appendChild(card);
  var dialog = document.createElement("dialog");
  dialog.innerHTML = "";
  

  database.ref('product').on('child_removed', function(data) {
    var productCard = document.getElementById("card-" + data.key);
    if (productCard != null) {
      productCard.remove();
    }
  });
  
  
  if (!product.productLink.includes("http")) {
    console.log("issue")
    dialog.innerHTML += "<h2>" + "Linket til produktsiden er ugyldigt" + "" + "</a>" + "</h2>";
  } else {
    dialog.innerHTML += "<h2>" + "Link til produkt siden" + " " + "<a href='" + product.productLink + "' target='_blank'>" + "Her" + "</a>" + "</h2>";
    console.log("No issue")
    
  }
  
  
  dialog.innerHTML += "<button class='editBtn' onclick='editProduct(\"" + data.key + "\", \"" + product.name + "\", \"" + product.productLink + "\", \"" + product.normalPris + "\", \"" + product.link + "\", \"" + product.tilbudsPris + "\")' style='cursor: pointer; background-color: #ffcb05; color: #333; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin-right: 10px; border: none; border-radius: 5px;'>Opdater</button>" +
"<button onclick='deleteProduct(\"" + data.key + "\")' style=' cursor: pointer; background-color: #f44336; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin-right: 10px; border: none; border-radius: 5px;'>Slet tilbud</button>" +
"<button class='close-dialog-btn' style=' cursor: pointer; background-color: #ccc; color: #333; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border: none; border-radius: 5px;'>Luk</button>";
 ;
  dialog.id = "dialog-" + data.key;
  card.appendChild(dialog);
  

  var updateMaximize = card.querySelector('.editBtn');
  updateMaximize.addEventListener('click', function() {
    console.log("TEST")
    toggleForm(productForm);
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



//Edit product data
function editProduct(id, name, productLink, normalPris, tilbudsPris) {
  document.getElementById("name").value = name;
  document.getElementById("productLink").value = productLink;
  document.getElementById("normalPris").value = normalPris;
  
  document.getElementById("tilbudsPris").value = tilbudsPris;
  console.log(id)
  document.getElementById('product-add').style.visibility = 'hidden';
  var updateButton = document.getElementById("update-product-button");
  updateButton.style.display = "block";
  updateButton.onclick = function(event) {
    console.log("runs")
    
    var updatedName = document.getElementById("name").value;
    var updatedProductLink = document.getElementById("productLink").value;
    var updatedNormalPris = document.getElementById("normalPris").value;
  
    var updatedTilbudsPris = document.getElementById("tilbudsPris").value;
  
    fetch('https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app/product/' + id + '.json', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
        name: updatedName,
        productLink: updatedProductLink,
        normalPris: updatedNormalPris,
       
        tilbudsPris: updatedTilbudsPris,
      })
    })
    .then(response => {
    
      return response.json();
   
    });
  }
}



