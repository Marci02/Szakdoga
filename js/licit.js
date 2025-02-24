// Nyitó és záró funkciók a menü kezeléséhez
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
// Feltöltés modal megnyitása
function openUploadModal() {
  console.log("Popup megnyitása");

  

  var modal = document.createElement("div");
  modal.id = "uploadModal";
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.width = "400px";  // Növelt szélesség
  modal.style.padding = "30px";  // Növelt padding
  modal.style.backgroundColor = "#fff";
  modal.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.3)";
  modal.style.borderRadius = "15px";
  modal.style.height = "auto";
  modal.style.zIndex = "1000";
  modal.style.textAlign = "center";
  modal.style.display = "block"; // Megjelenítés

  var modalContent = document.createElement("div");
  modalContent.innerHTML = `
  <h2 style="font-size: 1.8em; font-weight: bold; color: #222; margin-bottom: 20px;">Termék feltöltése</h2>

<!-- Input mezők és textarea -->
<input type="text" id="fileTitle" placeholder="Termék címe" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">

<input type="file" id="fileInput" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">

<textarea id="fileDesc" rows="5" style="width: 100%; resize:none; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;" placeholder="Leírás"></textarea>

<input type="number" id="filePrice" placeholder="Ár (Ft)" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">

<input type="number" id="fileBidStep" placeholder="Licit lépcső (Ft)" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">

<input type="number" id="fileQuantity" placeholder="Darabszám" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">

<!-- Kategória választó -->
<select id="fileCategory" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">
  <option value="" disabled selected>Kategória kiválasztása</option>
  <option value="ruhák">Ruhák</option>
  <option value="cipők">Cipők</option>
  <option value="kiegészítők">Kiegészítők</option>
</select>

<!-- Méret választó -->
<select id="fileSize" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">
  <option value="" disabled selected>Válassz méretet</option>
  <option value="35">35</option>
  <option value="36">36</option>
  <option value="37">37</option>
  <option value="38">38</option>
  <option value="39">39</option>
  <option value="40">40</option>
  <option value="41">41</option>
  <option value="42">42</option>
  <option value="43">43</option>
  <option value="44">44</option>
  <option value="45">45</option>
  <option value="46">46</option>
  <option value="47">47</option>
  <option value="48">48</option>
</select>

<!-- Állapot választó -->
<select id="fileCondition" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">
  <option value="" disabled selected>Válassz állapotot</option>
  <option value="Új">Új</option>
  <option value="Újszerű">Újszerű</option>
  <option value="Használt">Használt</option>
  <option value="Nagyon használt">Nagyon használt</option>
</select>

<input type="text" id="fileBrand" placeholder="Márka" style="width: 100%; padding: 10px; margin-bottom: 25px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">

<!-- Gombok -->
<div style="display: flex; justify-content: space-between;">
  <button onclick="uploadFile()" style="background-color: #22222a; color: white; padding: 12px 20px; border-radius: 8px; border: none; font-size: 16px; width: 48%; cursor: pointer; transition: background-color 0.3s ease;">
    Feltöltés
  </button>
  
  <button onclick="closeUploadModal()" style="background-color: #ecf0f1; color: #333; padding: 12px 20px; border-radius: 8px; border: 1px solid #ddd; font-size: 16px; width: 48%; cursor: pointer; transition: background-color 0.3s ease;">
    Mégse
  </button>
</div>

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
  overlay.style.transition = "opacity 0.3s ease-in-out";
  overlay.style.opacity = "0";

  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";

  setTimeout(() => {
      modal.style.opacity = "1";
      overlay.style.opacity = "1";
  }, 50);
}





// Feltöltés modal bezárása
function closeUploadModal() {
  var modal = document.getElementById("uploadModal");
  var overlay = document.getElementById("modalOverlay");

  if (modal) {
      modal.style.opacity = "0";  // Fade out
  }
  if (overlay) {
      overlay.style.opacity = "0";  // Fade out
  }

  setTimeout(() => {
      if (modal) modal.remove();
      if (overlay) overlay.remove();
      document.body.style.overflow = "auto";
  }, 300);
}


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
function placeBid() {
  var bidStep = document.getElementById("bidStep").value;
  var currentPrice = parseInt(document.getElementById("priceValue").innerText.replace(" Ft", ""));

  if (bidStep && !isNaN(bidStep)) {
      var newPrice = currentPrice + parseInt(bidStep);
      document.getElementById("priceValue").innerText = newPrice + " Ft";
      alert("Licitálás sikeres! Az új ár: " + newPrice + " Ft");
  } else {
      alert("Kérjük, adja meg a licit lépést!");
  }
}

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

  setTimeout(() => {
      modal.style.opacity = "1";
      document.body.style.overflow = "hidden";
  }, 50);
}

function closeModal() {
  var modal = document.querySelector("div[style*='position: fixed']");
  var overlay = document.querySelector("div[style*='background-color: rgba(0,0,0,0.5)']");

  if (modal) modal.remove();
  if (overlay) overlay.remove();
}

let currentBidPrice = 0;

function placeBidInModal(originalPrice, bidStep) {
  if (currentBidPrice === 0) {
      currentBidPrice = originalPrice;
  }

  let newPrice = currentBidPrice + bidStep;
  document.getElementById("newPrice").innerText = newPrice + " Ft";
  currentBidPrice = newPrice;

  alert("Licitálás sikeres! Az új ár: " + newPrice + " Ft");
}

function toggleCategory(categoryId) {
  var category = document.getElementById(categoryId);
  
  // A kategória bontása vagy összecsukása
  if (category.style.display === "block") {
      category.style.display = "none";  // Ha látszik, elrejtjük
  } else {
      category.style.display = "block"; // Ha el van rejtve, megjelenítjük
  }

  
}

function updatePriceValue() {
  var priceRange = document.getElementById('price-range');
  var priceValue = document.getElementById('price-value');
  priceValue.textContent = priceRange.value + " Ft";
}


