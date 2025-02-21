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
  modal.style.width = "400px";  // Növelt szélesség
  modal.style.padding = "300px";  // Növelt padding
  modal.style.backgroundColor = "#fff";
  modal.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.1)";
  modal.style.borderRadius = "15px";
  modal.style.zIndex = "1000";
  modal.style.textAlign = "center";

  var modalContent = document.createElement("div");
  modalContent.innerHTML = `
    <img src="image.jpg" alt="Product" class="popup-image">
    <h3 class="popup-title">Termék feltöltése</h3>
    <input type="text" id="fileTitle" placeholder="Termék címének megadása" style="width: 100%; padding: 5px; margin-top: 10px;">
    <input type="file" id="fileInput" style="cursor: pointer; margin-top: 10px;">
    <h4 style="margin-top: 10px;">Leírás:</h4>
    <textarea id="fileDesc" rows="5" style="width: 100%; padding: 5px; margin-top: 10px;"></textarea>
    <button onclick="uploadFile()" style="cursor: pointer; padding: 6px; color: white; background-color: #3498db; border-radius: 5px; border: none; margin-top: 20px; width: 100%;">Feltöltés</button>
    <button onclick="closeUploadModal()" style="cursor: pointer; padding: 5px; background-color: white; border-radius: 5px; border: 1px solid #ccc; margin-top: 20px; width: 100%;">Mégse</button>
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
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "999";
  overlay.onclick = closeUploadModal;

  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";
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

function showProductDetails(title, description, imageUrl, price, bidStep) {
  var modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.width = "80%";
  modal.style.maxWidth = "600px";
  modal.style.backgroundColor = "#fff";
  modal.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.1)";
  modal.style.zIndex = "1000";
  modal.style.padding = "30px";
  modal.style.borderRadius = "8px";
  modal.style.overflowY = "auto";
  modal.style.transition = "opacity 0.3s ease-in-out";

  var modalContent = document.createElement("div");

  modalContent.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="font-size: 1.8em; font-weight: bold; color: #333;">${title}</h2>
      <img src="${imageUrl}" alt="${title}" class="product-image" style="width: 100%; height: 300px; border-radius: 8px; object-fit: cover; margin-top: 10px;">
    </div>
    <p style="font-size: 1em; color: #666; text-align: justify;">${description}</p>
    <div style="margin-top: 20px; font-size: 1.2em; font-weight: bold;">
      <p style="color: #e74c3c;">Alap ár: <span id="originalPrice">${price} Ft</span></p>
      <p>Licit lépcső: ${bidStep} Ft</p>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
      <button onclick="placeBidInModal(${price}, ${bidStep})" class="button" style="background-color: #3498db; color: white; border: none; padding: 12px 20px; border-radius: 5px; font-size: 1.1em; cursor: pointer; transition: background-color 0.3s ease;">
        Licitálás
      </button>
      <p id="bidAmount" style="font-size: 1.2em;">Aktuális ár: <span id="newPrice">${price} Ft</span></p>
    </div>
    <div style="display: flex; justify-content: flex-end; margin-top: 30px;">
      <button onclick="closeModal()" class="button" style="background-color: #e74c3c; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-size: 1.1em; transition: background-color 0.3s ease;">
        Bezárás
      </button>
    </div>
  `;
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Modal opacity animáció beállítása
  setTimeout(() => {
    modal.style.opacity = "1"; // Modal megjelenítése
    document.body.style.overflow = "hidden";  // A háttér görgetésének letiltása
  }, 50);
}

function closeModal() {
  var modal = document.querySelector("div[style*='position: fixed']");
  
  if (modal) {
    // Az animációval lecsökkentjük az opacity-t
    modal.style.opacity = "0";

    // Az animáció után eltávolítjuk az elemet a DOM-ból
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = "auto";  // A háttér görgetésének visszaállítása
    }, 300);  // 300 ms, hogy az animáció végigfusson
  }
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