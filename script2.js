  // Perform the search
  fetch("https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app/product.json?orderBy=\"name\"&equalTo=\"" + searchTerm + "\"")
    .then(response => response.json())
    .then(data => {
      // Clear previous results
      resultsDiv.innerHTML = "";

      // Display the results
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          var pokemon = data[key];
          var card = document.createElement("div");
          card.innerHTML = "<h3>" + pokemon.name + "</h3>" +
                           "<img src='" + pokemon.productLink + "' alt='" + pokemon.name + "'>" +
                           "<p></p>";
          resultsDiv.appendChild(card);
        }
      }
    })
    .catch(error => console.error(error));


