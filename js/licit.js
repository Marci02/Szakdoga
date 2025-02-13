// Nyitó és záró funkciók a menü kezeléséhez
function openNav() {
  document.getElementById("menu").style.width = "300px";
}

function closeNav() {
  document.getElementById("menu").style.width = "0";
}

// Sticky navigáció
function stickyNav() {
  var headerHeight = document.querySelector("#about").offsetHeight / 2;
  var navbar = document.querySelector("nav");
  var scrollValue = window.scrollY;

  if (scrollValue > headerHeight) {
    navbar.classList.add("header-sticky");
  } else {
    navbar.classList.remove("header-sticky");
  }
}

window.addEventListener("scroll", stickyNav);

// Keresési funkció
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

// Kereső gomb megjelenítése/elrejtése
function toggleSearch() {
  var x = document.getElementById("searchBtn");
  if (x.style.display === "none" || x.style.display === "") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

// Kosár és kereső gombok elrejtése
document.getElementById("searchBtn").style.display = "none";
document.getElementById("cartBtn").style.display = "none";

document.getElementById("cartBtn").parentElement.addEventListener("mouseenter", function() {
  document.getElementById("cartBtn").style.display = "block";
});

document.getElementById("cartBtn").parentElement.addEventListener("mouseleave", function() {
  document.getElementById("cartBtn").style.display = "none";
});

// Feltöltés modal ablak
function openUploadModal() {
  console.log("Popup megnyitása");

  // Ha már van ilyen elem, először töröljük, hogy ne legyen duplikáció
  var existingModal = document.getElementById("uploadModal");
  if (existingModal) {
      existingModal.remove();
  }

  var modal = document.createElement("div");
  modal.id = "uploadModal";
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.height = "auto";
  modal.style.width = "400px";
  modal.style.padding = "20px";
  modal.style.backgroundColor = "#fff";
  modal.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
  modal.style.zIndex = "1000";
  modal.style.borderRadius = "5px";

  var modalContent = document.createElement("div");
  modalContent.innerHTML = `
      <h2>Termék feltöltése</h2>
      <input type="text" id="fileTitle" placeholder="Termék címének megadása" style="width: 100%; padding: 5px;">
      <input type="file" id="fileInput" style="cursor: pointer;">
      <h4>Leírás:</h4>
      <textarea id="fileDesc" rows="5" style="width: 100%; padding: 5px;"></textarea>
      <button onclick="uploadFile()" style="cursor: pointer; padding:6px; color: white; background-color: black; border-radius: 5px; border: none;">Feltöltés</button>
      <button onclick="closeUploadModal()" style="cursor: pointer; padding:5px; background-color: white; border-radius: 5px;">Mégse</button>
  `;
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  var overlay = document.createElement("div");
  overlay.id = "modalOverlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
  overlay.style.zIndex = "999";
  overlay.onclick = closeUploadModal;

  document.body.appendChild(overlay);
}

function closeUploadModal() {
  var modal = document.getElementById("uploadModal");
  var overlay = document.getElementById("modalOverlay");
  if (modal) modal.remove();
  if (overlay) overlay.remove();
}

// Feltöltött termékek hozzáadása
// Feltöltött termékek hozzáadása
function uploadFile() {
  var fileTitle = document.getElementById("fileTitle").value;
  var fileDesc = document.getElementById("fileDesc").value;
  var fileInput = document.getElementById("fileInput").files[0];
  var productPrice = document.getElementById("productPrice").value;
  var bidStep = document.getElementById("bidStep").value;

  if (fileTitle && fileDesc && fileInput && productPrice && bidStep) {
      var reader = new FileReader();
      reader.onload = function (e) {
          var productList = document.querySelector(".product-list");

          if (productList) {
              var productCard = document.createElement("div");
              productCard.className = "product-card";
              productCard.innerHTML = `
                  <img src="${e.target.result}" alt="${fileTitle}" class="product-image">
                  <h3>${fileTitle}</h3>
                  <p>${fileDesc}</p>
                  <p><strong>Ár:</strong> ${productPrice} Ft</p>
                  <p><strong>Licit lépcső:</strong> ${bidStep} Ft</p>
              `;

              productCard.style.cursor = "pointer"; 

              productCard.addEventListener("click", function () {
                  showProductDetails(fileTitle, fileDesc, e.target.result, productPrice, bidStep);
              });

              var productImage = productCard.querySelector("img");
              productImage.style.width = "100%";
              productImage.style.height = "200px";
              productImage.style.borderRadius = "5px";

              productList.insertBefore(productCard, productList.firstChild);
              closeUploadModal();
          } else {
              console.error("Nem található .product-list elem!");
          }
      };
      reader.readAsDataURL(fileInput);
  } else {
      alert("Kérjük, töltse ki az összes mezőt és válasszon egy fájlt.");
  }
}

// Licitálás funkció
// Licitálás funkció, amely több alkalommal is működik
function placeBid() {
  var bidStep = document.getElementById("bidStep").value; // A licit lépés
  var currentPrice = parseInt(document.getElementById("priceValue").innerText.replace(" Ft", "")); // Jelenlegi ár
  
  // Ellenőrizzük, hogy a licit lépés szám
  if (bidStep && !isNaN(bidStep)) {
      var newPrice = currentPrice + parseInt(bidStep); // Új ár kiszámítása

      // A megjelenített ár frissítése
      document.getElementById("priceValue").innerText = newPrice + " Ft"; 
      
      // További logikák hozzáadása itt, ha szükséges
      alert("Licitálás sikeres! Az új ár: " + newPrice + " Ft");
  } else {
      alert("Kérjük, adja meg a licit lépést!");
  }
}


// A feltöltéskor beállítjuk az árat a modal ablakban
function setPriceInModal(price) {
  document.getElementById("priceValue").innerText = price + " Ft";
}

// A termék adatait megjelenítő rész (példa)
// A termék adatait megjelenítő rész (példa)
// A termék adatait megjelenítő rész (példa)
// A termék adatait megjelenítő rész (példa)
// A termék adatait megjelenítő rész (példa)
// A termék adatait megjelenítő rész (példa)
// A termék adatait megjelenítő rész (példa)
function showProductDetails(title, description, imageUrl, price, bidStep) {
  var modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.width = "400px";
  modal.style.height = "auto";
  modal.style.backgroundColor = "#fff";
  modal.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
  modal.style.zIndex = "1000";
  modal.style.padding = "20px";
  modal.style.borderRadius = "5px";

  var modalContent = document.createElement("div");

  // Kép és a név középen
  modalContent.innerHTML = `
      <div style="text-align: center;">
          <h2>${title}</h2>
          <img src="${imageUrl}" alt="${title}" style="width: 100%; height: 200px; border-radius: 5px; margin-top: 10px;">
      </div>
      <p><strong>Leírás:</strong> ${description}</p>
      <p><strong>Alap ár:</strong> <span id="originalPrice">${price} Ft</span></p>
      <p><strong>Licit lépcső:</strong> ${bidStep} Ft</p>

      <!-- Licitálás mező -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
        <button onclick="placeBidInModal(${price}, ${bidStep})" style="cursor: pointer; padding: 6px 12px; background-color: black; color: white; border-radius: 5px; border: none;">Emelés</button>
        <p id="bidAmount" style="margin-left: 10px;">Aktuális ár: <span id="newPrice">${price} Ft</span></p>
      </div>

      <!-- Zárás gomb és licit lépcső egyvonalba -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
        <button onclick="closeModal()" style="cursor: pointer; padding: 6px 12px; background-color: black; color: white; border-radius: 5px; border: none;">Bezárás</button>
      </div>
  `;
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  var overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
  overlay.style.zIndex = "999";
  overlay.onclick = closeModal;
  document.body.appendChild(overlay);
}

// Licitálás funkció az ablakban
let currentBidPrice = 0;  // Ez tárolja az aktuális licit árat

function placeBidInModal(originalPrice, bidStep) {
  // Ha az aktuális ár még nincs inicializálva, akkor most beállítjuk
  if (currentBidPrice === 0) {
    currentBidPrice = originalPrice;  // A feltöltött alapár lesz az alap
  }

  // Az új ár kiszámítása a licit lépéssel
  let newPrice = currentBidPrice + bidStep;

  // A megjelenített ár frissítése
  document.getElementById("newPrice").innerText = newPrice + " Ft";  // Frissítjük a modal-ban lévő árat

  // Frissítjük az aktuális árfolyamot
  currentBidPrice = newPrice;

  // Licitálás sikeressége
  alert("Licitálás sikeres! Az új ár: " + newPrice + " Ft");
}

function closeModal() {
  var modal = document.querySelector("div[style*='position: fixed']");
  var overlay = document.querySelector("div[style*='background-color: rgba(0,0,0,0.5)']");
  if (modal) modal.remove();
  if (overlay) overlay.remove();
}

// Feltöltés modal megnyitása
function openUploadModal() {
  var modal = document.getElementById("uploadModal");
  if (modal) {
      modal.style.display = "block";  // Modális ablak megjelenítése
  }
}

// Feltöltés modal bezárása
function closeUploadModal() {
  var modal = document.getElementById("uploadModal");
  if (modal) {
      modal.style.display = "none";  // Modális ablak elrejtése
  }
}