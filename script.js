"use strict";
const prevScrollpos = window.pageYOffset;

window.addEventListener("scroll", () => {
  const currentScrollPos = window.pageYOffset;
  const header = document.getElementById("myHeader");
  header.style.top = prevScrollpos > currentScrollPos ? "0" : "-150px";
  prevScrollpos = currentScrollPos;
  });

const endpoint = "https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app";

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

window.addEventListener("load", init);

//Handle form submission
async function addProduct() {
  //Get form values from the form
  var name = document.getElementById("name").value;
  var productLink = document.getElementById("productLink").value;
  var link = document.getElementById("link").value;
  var normalPris = document.getElementById("normalPris").value;
  var tilbudsPris = document.getElementById("tilbudsPris").value;
  var date = new Date();
  var options1 = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'Europe/Copenhagen' };
  var formattedDate = date.toLocaleString('da-DK', options1);

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

  await fetch(url, options)
    .then(response => response.json())
    .then(data => console.log('New product added:', data))

  //Clear form fields
  const form = document.getElementById('product-form');

  form.reset();
  location.reload();
  toggleForm();
}

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

const searchInput = document.getElementById("search");
const resultsDiv = document.getElementById("results");

searchInput.addEventListener("input", async () => {
  const searchTerm = searchInput.value.toLowerCase().trim();
  if (searchTerm === '') return;
  try {
    const response = await fetch("https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app/product.json?orderBy=\"name\"");
    const data = await response.json();
    resultsDiv.innerHTML = '';
    for (const [key, value] of Object.entries(data)) {
      if (value.name.toLowerCase().includes(searchTerm)) {
        const card = document.createElement("div");
        card.innerHTML = `
          <h3>${value.name}</h3>
          <img style='max-width:300px' src='${value.link}' alt='${value.name}'>
          <h3 style='text-align: center;'>Pris: <span style='text-decoration: line-through; color: grey;'>${value.normalPris}</span> <strong>${value.tilbudsPris}</strong></h3>
          <h2>${value.productLink.startsWith("http") ? `Link til produkt siden <a href='${value.productLink}' target='_blank'>Her</a>` : "Linket til produktsiden er ugyldigt"}</h2>
        `;
        card.style.border = "1px solid #ccc";
        card.style.padding = "10px";
        resultsDiv.appendChild(card);
      }
    }
  } catch (error) {
    console.error(error);
  }
});

//Delete product data function using id
async function deleteProduct(id) {
  const response = await fetch(`https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app/product/${id}.json`, {
    method: 'DELETE'
  });
  const json = await response.json();
  location.reload();
}

//Display product cards and dialog (NOT REST CALL)
var productCards = document.getElementById("product-cards");

async function init() {
  toggleForm();
  await fetch(`${endpoint}/product.json`)
    .then(response => response.json())
    .then(data => {
      for (const key in data) {
        const product = data[key];
        const card = document.createElement("div");
        card.className = "product-card";
        card.id = "card-" + key;
        card.innerHTML = "<h1 style='text-align: center;'>" + product.name + "</h1>";

        if (product.link && product.link.includes("http")) {
          card.innerHTML += "<img src='" + product.link + "'>";
        }

        card.innerHTML += "<h3 style='text-align: center;'>Pris: <span style='text-decoration: line-through; color: grey;'>" + product.normalPris + "</span> <strong>" + product.tilbudsPris + "</strong></h3>";
        card.innerHTML += "<p>" + "Oprettet:" + " " + product.createdAt + "</p>";
        card.innerHTML += "<button style='width: 30%; display: block; margin: 0 auto;' class='view-more-btn'>Se mere</button>";

        const button = card.querySelector('.view-more-btn');
        button.style.textAlign = "center";

        productCards.appendChild(card);
        const dialog = document.createElement("dialog");
        dialog.innerHTML = "";

        if (!product.productLink.includes("http")) {
          console.log("issue")
          dialog.innerHTML += "<h2>" + "Linket til produktsiden er ugyldigt" + "" + "</a>" + "</h2>";
        } else {
          dialog.innerHTML += "<h2>" + "Link til produkt siden" + " " + "<a href='" + product.productLink + "' target='_blank'>" + "Her" + "</a>" + "</h2>";
          console.log("No issue")
        }

        dialog.innerHTML += "<button class='editBtn' onclick='editProduct(\"" + key + "\", \"" + product.name + "\", \"" + product.productLink + "\",  \"" + product.link + "\", \"" + product.normalPris + "\", \"" + product.createdAt + "\", \"" + product.tilbudsPris + "\")' style='cursor: pointer; background-color: #ffcb05; color: #333; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin-right: 10px; border: none; border-radius: 5px;'>Opdater</button>" +
          "<button onclick='deleteProduct(\"" + key + "\")' style=' cursor: pointer; background-color: #f44336; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin-right: 10px; border: none; border-radius: 5px;'>Slet tilbud</button>" +
          "<button class='close-dialog-btn' style=' cursor: pointer; background-color: #ccc; color: #333; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border: none; border-radius: 5px;'>Luk</button>";

        dialog.id = "dialog-" + key;
        card.appendChild(dialog);

        var updateMaximize = card.querySelector('.editBtn');
        updateMaximize.addEventListener('click', function () {
          toggleForm();
          dialog.close();
        });

        var viewMoreBtn = card.querySelector('.view-more-btn');

        viewMoreBtn.addEventListener('click', function () {
          var dialog = document.querySelector("#dialog-" + key);

          dialog.showModal();

        });
        var closeDialogBtn = dialog.querySelector(".close-dialog-btn");
        closeDialogBtn.addEventListener("click", function () {
          dialog.close();
        });
      };
    });
}

//Edit product data
async function editProduct(id, name, productLink, link, normalPris, createdAt, tilbudsPris) {
  document.getElementById("name").value = name;
  document.getElementById("productLink").value = productLink;
  document.getElementById("link").value = link;
  document.getElementById("normalPris").value = normalPris;
  document.getElementById("tilbudsPris").value = tilbudsPris;
  document.getElementById('product-add').style.visibility = 'hidden';

  var updateButton = document.getElementById("update-product-button");
  updateButton.style.display = "block";
  updateButton.onclick = async function () {
    var updatedName = document.getElementById("name").value;
    var updatedProductLink = document.getElementById("productLink").value;
    var updatedLink = document.getElementById("link").value;
    var updatedNormalPris = document.getElementById("normalPris").value;
    var updatedTilbudsPris = document.getElementById("tilbudsPris").value;

    try {
      const response = await fetch('https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app/product/' + id + '.json', {
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
          link: updatedLink,
          createdAt: createdAt,
        })
      });

      location.reload();
      return response.json();
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }
}
