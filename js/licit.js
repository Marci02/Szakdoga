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
function uploadFile() {
  var fileTitle = document.getElementById("fileTitle").value;
  var fileDesc = document.getElementById("fileDesc").value;
  var fileInput = document.getElementById("fileInput").files[0];

  if (fileTitle && fileDesc && fileInput) {
      var reader = new FileReader();
      reader.onload = function(e) {
          var productList = document.querySelector(".product-list");

          if (productList) {
              var productCard = document.createElement("div");
              productCard.className = "product-card";
              productCard.innerHTML = `
                  <img src="${e.target.result}" alt="${fileTitle}" class="product-image">
                  <h3>${fileTitle}</h3>
                  <p>${fileDesc}</p>
              `;

              // Cursor pointer hozzáadása, amikor ráviszik a kurzort
              productCard.style.transition = "transform 0.3s ease";
              productCard.style.cursor = "pointer"; // Kurzor pointer beállítása

              productCard.addEventListener("mouseenter", function() {
                  productCard.style.transform = "scale(1.05)";
              });
              productCard.addEventListener("mouseleave", function() {
                  productCard.style.transform = "scale(1)";
              });

              // Kattintás esemény a termék részletekhez
              productCard.addEventListener("click", function() {
                  showProductDetails(fileTitle, fileDesc, e.target.result);
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

// Termék részletes megjelenítése egy modálban
function showProductDetails(title, description, imageUrl) {
  var modal = document.createElement("div");
  modal.id = "productDetailModal";
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.width = "400px";
  modal.style.height = "auto";
  modal.style.padding = "20px";
  modal.style.backgroundColor = "#fff";
  modal.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
  modal.style.zIndex = "1000";
  modal.style.borderRadius = "5px";

  var modalContent = document.createElement("div");
  modalContent.innerHTML = `
    <h2>${title}</h2>
    <img src="${imageUrl}" alt="${title}" style="width: 100%; height: 200px; border-radius: 5px;">
    <p>${description}</p>
    <button onclick="closeProductDetailModal()" style="cursor: pointer; padding:5px; background-color: white; border-radius: 5px;">Bezárás</button>
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
  overlay.onclick = closeProductDetailModal;

  document.body.appendChild(overlay);
}

// Termék részletező modál bezárása
function closeProductDetailModal() {
  var modal = document.getElementById("productDetailModal");
  var overlay = document.getElementById("modalOverlay");
  if (modal) modal.remove();
  if (overlay) overlay.remove();
}
