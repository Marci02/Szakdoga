function stickyNav() {
  var headerHeight = document.querySelector(".container").offsetHeight / 2;
  var navbar = document.querySelector("nav");
  var scrollValue = window.scrollY;

  if (scrollValue > headerHeight) {
    navbar.classList.add("header-sticky");
  } else {
    navbar.classList.remove("header-sticky");
  }
}

window.addEventListener("scroll", stickyNav);

function search() {
  var searchTerm = document.getElementById('search').value;

  if (searchTerm === 'apple') {
    document.getElementById('output').innerHTML = 'Search term matched: apple';
  } else if (searchTerm === 'banana') {
    document.getElementById('output').innerHTML = 'Search term matched: banana';
  } else {
    document.getElementById('output').innerHTML = 'No matching result for the search term: ' + searchTerm;
  }
}

function toggleSearch() {
  var x = document.getElementById("searchBtn");
  if (x.style.display === "none" || x.style.display === "") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

document.getElementById("searchBtn").style.display = "none";
document.getElementById("cartBtn").style.display = "none";

document.getElementById("cartBtn").parentElement.addEventListener("mouseenter", function() {
  document.getElementById("cartBtn").style.display = "block";
});

document.getElementById("cartBtn").parentElement.addEventListener("mouseleave", function() {
  document.getElementById("cartBtn").style.display = "none";
});

function openUploadModal() {
  var modal = document.createElement("div");
  modal.id = "uploadModal";
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.height = "auto";
  modal.style.lineHeight = "2";
  modal.style.width = "400px";
  modal.style.padding = "40px";
  modal.style.backgroundColor = "#fff";
  modal.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
  modal.style.zIndex = "1000";
  modal.style.borderRadius = "5px";

  var modalContent = document.createElement("div");
  modalContent.innerHTML = `
    <h2 style="margin-bottom: 20px;">Termék feltöltése</h2>
    <input type="text" id="fileTitle" placeholder="Termék címe" style="width: 300px; padding: 5px;">
    <input type="file" id="fileInput" style="cursor: pointer;">
    <h4>Leírás:</h4>
    <textarea id="fileDesc" rows="5" cols="50" style="padding:5px; resize: none; width: 300px;" placeholder="Termék rövid leírása"></textarea>
    <h4>Ár:</h4>
    <input type="number" id="filePrice" placeholder="Termék ára" style="width: 300px; padding: 5px; margin-bottom: 15px;" min="0">
    <h4>Darab:</h4>
    <input type="number" id="fileQuantity" placeholder="Termék darabszáma" style="width: 300px; padding: 5px; margin-bottom: 15px;" min="1">
    <h4>Kategória:</h4>
    <input type="text" id="fileCategory" placeholder="Termék kategóriája" style="width: 300px; padding: 5px; margin-bottom: 15px;">
    <h4>Márka:</h4>
    <input type="text" id="fileBrand" placeholder="Márka neve" style="width: 300px; padding: 5px; margin-bottom: 15px;">
    <button onclick="uploadFile()" style="cursor: pointer; padding:6px; color: white; background-color: black; border-radius: 5px; border: none;">Feltöltés</button>
    <button onclick="closeUploadModal()" style="cursor: pointer; padding:5px; background-color: white; border-radius: 5px;">Mégse</button>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}

function closeUploadModal() {
  var modal = document.getElementById("uploadModal");
  if (modal) {
    document.body.removeChild(modal);
  }
}

function uploadFile() {
  var fileTitle = document.getElementById("fileTitle").value;
  var fileDesc = document.getElementById("fileDesc").value;
  var filePrice = document.getElementById("filePrice").value;
  var fileQuantity = document.getElementById("fileQuantity").value;
  var fileCategory = document.getElementById("fileCategory").value;
  var fileBrand = document.getElementById("fileBrand").value;
  var fileInput = document.getElementById("fileInput").files[0];

  if (fileTitle && fileDesc && filePrice && fileQuantity && fileCategory && fileBrand && fileInput) {
    var formData = new FormData();
    formData.append("fileTitle", fileTitle);
    formData.append("fileDesc", fileDesc);
    formData.append("filePrice", filePrice);
    formData.append("fileQuantity", fileQuantity);
    formData.append("fileCategory", fileCategory);
    formData.append("fileBrand", fileBrand);
    formData.append("fileInput", fileInput);

    fetch("backend/ossztermekupload.php", {
      method: "POST",
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      alert(data.message);
      closeUploadModal();
      fetchProducts(); // Terméklista frissítése feltöltés után
    })
    .catch(error => console.error("Error:", error));
  } else {
    alert("Minden mezőt ki kell tölteni!");
  }
}

// Termékek lekérése az adatbázisból és megjelenítése az oldalon
function fetchProducts() {
  fetch("backend/ossztermeklekero.php") // A megfelelő PHP endpointot használd
    .then(response => response.json())
    .then(data => {
      var productList = document.querySelector(".product-list");
      productList.innerHTML = ""; // Ürítjük a listát

      data.forEach(product => {
        var productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.innerHTML = `
          <img src="${product.image}" alt="${product.title}" class="product-image">
          <h3>${product.title}</h3>
          <p>${product.description}</p>
          <h3>Ár: ${product.price} Ft</h3>
        `;

        productList.appendChild(productCard);
      });
    })
    .catch(error => console.error("Hiba a termékek lekérésekor:", error));
}

// Oldal betöltésekor hívjuk meg
document.addEventListener("DOMContentLoaded", fetchProducts);