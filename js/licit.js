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
<input type="text" id="fileTitle" placeholder="Termék címe" maxlength="20"; style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">

<input type="file" id="fileInput" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;" >

<textarea id="fileDesc" rows="5" style="width: 100%; resize:none; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;" placeholder="Leírás"></textarea>

<input type="number" id="filePrice" placeholder="Ár (Ft)" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">

<input type="number" id="fileBidStep" placeholder="Licit lépcső (Ft)" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">

<!-- Kategória választó -->
<select id="fileCategory" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;" onchange="updateFormBasedOnCategory()">
  <option value="" disabled selected>Kategória kiválasztása</option>
  <option value="ruhák">Ruhák</option>
  <option value="cipők">Cipők</option>
  <option value="kiegészítők">Kiegészítők</option>
</select>

<!-- Dinamikus mezők itt fognak megjelenni -->
<div id="dynamicFields"></div>

<input type="text" id="fileBrand" placeholder="Márka" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">

<!-- Licit vége mező -->
<input type="datetime-local" id="fileBidEnd" style="width: 100%; padding: 10px; margin-bottom: 25px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;" placeholder="Licit vége">

<!-- Gombok -->
<div style="display: flex; justify-content: space-between;">
  <button onclick="uploadFile()" style="background-color: #22222a; color: white; padding: 12px 20px; border-radius: 8px; border: none; font-size: 16px; width: 48%; cursor: pointer; transition: background-color 0.3s ease;">
    Feltöltés
  </button>
  
  <button onclick="closeUploadModal()" style="background-color: #ecf0f1; color: #333; padding: 12px 20px; border-radius: 8px; border: 1px solid #ddd; font-size: 16px; width: 48%; cursor: pointer; transition: background-color 0.3s ease;">
    Mégse
  </button>
</div>

<script>
  function checkBidEnd() {
    const bidEndInput = document.getElementById("fileBidEnd").value;
    const bidEndTime = new Date(bidEndInput).getTime();
    const currentTime = new Date().getTime();
    
    if (bidEndTime && currentTime >= bidEndTime) {
      document.getElementById("productCard").style.display = "none";
    }
  }

  setInterval(checkBidEnd, 1000); // Ellenőrzés minden másodpercben
</script>

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

// Kategória alapján a dinamikus mezők frissítése
function updateFormBasedOnCategory() {
  var category = document.getElementById("fileCategory").value;
  var dynamicFields = document.getElementById("dynamicFields");

  // Töröljük az eddigi dinamikus mezőket
  dynamicFields.innerHTML = '';

  // Kategóriától függő mezők hozzáadása
  if (category === "cipők") {
    dynamicFields.innerHTML = `
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
    `;
  } else if (category === "ruhák") {
    dynamicFields.innerHTML = `
      <select id="fileSize" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">
        <option value="" disabled selected>Válassz méretet</option>
        <option value="XS">XS</option>
        <option value="S">S</option>
        <option value="M">M</option>
        <option value="L">L</option>
        <option value="XL">XL</option>
        <option value="XXL">XXL</option>
      </select>
    `;
  } else if (category === "kiegészítők") {
    dynamicFields.innerHTML = ''; // Itt nincs extra mező
  }

  // Állapot választó minden kategóriához
  dynamicFields.innerHTML += `
    <select id="fileCondition" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">
      <option value="" disabled selected>Válassz állapotot</option>
      <option value="Új">Új</option>
      <option value="Újszerű">Újszerű</option>
      <option value="Használt">Használt</option>
      <option value="Nagyon használt">Nagyon használt</option>
    </select>
  `;
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
  var productPrice = document.getElementById("filePrice").value;
  var bidStep = document.getElementById("fileBidStep").value;
  var fileSize = document.getElementById("fileSize") ? document.getElementById("fileSize").value : "";
  var fileCondition = document.getElementById("fileCondition") ? document.getElementById("fileCondition").value : "";
  var fileBrand = document.getElementById("fileBrand").value;
  var bidEndTime = document.getElementById("fileBidEnd").value;



  if (fileTitle && fileDesc && fileInput && productPrice && bidStep && bidEndTime) {
      var reader = new FileReader();
      reader.onload = function (e) {
          var productList = document.querySelector(".product-list");

          if (productList) {
              var productCard = document.createElement("div");
              productCard.className = "product-card";
              productCard.style.borderRadius = "15px";
              productCard.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.1)";
              productCard.style.marginBottom = "20px";
              productCard.style.backgroundColor = "#fff";
              productCard.style.overflow = "hidden";
              productCard.style.cursor = "pointer";
              productCard.style.transition = "transform 0.3s ease-in-out";
              productCard.addEventListener("mouseover", function() {
                  productCard.style.transform = "scale(1.05)";
              });
              productCard.addEventListener("mouseout", function() {
                  productCard.style.transform = "scale(1)";
              });

              productCard.innerHTML = `
                  <h3 style="font-size: 1.4em; font-weight: bold; color: #333; text-align: center; margin-top: 10px; ">${fileTitle}</h3>
                  <div style="text-align: center; margin-bottom: 15px;">
                      <img src="${e.target.result}" alt="${fileTitle}" class="product-image" style="width: 100%; height: 200px; object-fit: cover; border-radius: 15px;">
                  </div>
                  <div style="text-align: left">
                  <div style="font-size: 1em; font-weight: bold; color: #555; margin-top: 10px;">
                      <p><strong>Ár:</strong> ${productPrice} Ft</p>
                  </div>
                  <div class="product-info">
                      <p><strong>Licit lépcső:</strong> ${bidStep} Ft</p>
                      <p><strong>Méret:</strong> ${fileSize || 'N/A'}</p>
                      <p><strong>Állapot:</strong> ${fileCondition || 'N/A'}</p>
                      <p><strong>Márka:</strong> ${fileBrand || 'N/A'}</p>
                  </div>
                  <div style="font-size: 1em; color: #e74c3c; margin-top: 15px;">
                      <p><strong>Licit vége:</strong> <span class="countdown" id="countdown-${fileTitle}">Számolás...</span></p>
                  </div>
                  </div>
              `;

              productCard.addEventListener("click", function () {
                  if (productCard.style.pointerEvents !== 'none') {
                      showProductDetails(fileTitle, fileDesc, e.target.result, productPrice, bidStep, fileSize, fileCondition, fileBrand);
                  }
              });

              productList.insertBefore(productCard, productList.firstChild);
              closeUploadModal();
              startCountdown(bidEndTime, fileTitle, productCard);
          } else {
              console.error("Nem található .product-list elem!");
          }
      };
      reader.readAsDataURL(fileInput);
  } else {
      alert("Kérjük, töltse ki az összes mezőt és válasszon egy fájlt.");
  }
}


function startCountdown(bidEndTime, productTitle, productCard) {
  var countdownElement = document.getElementById("countdown-" + productTitle);
  var endTime = new Date(bidEndTime).getTime();

  var interval = setInterval(function () {
      var now = new Date().getTime();
      var timeLeft = endTime - now;

      if (timeLeft <= 0) {
          clearInterval(interval);
          countdownElement.innerHTML = "Licit vége";

          // 10 másodperccel a licit vége után eltüntetjük a kártyát
          setTimeout(function() {
              productCard.style.display = 'none'; 
          }, 10000); // 10 másodperc után eltűnik az egész kártya
      } else {
          var hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
          var minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
          var seconds = Math.floor((timeLeft / 1000) % 60);
          countdownElement.innerHTML = hours + " óra " + minutes + " perc " + seconds + " másodperc";
      }

      // Kattintás letiltása a licit vége után 10 másodpercig
      if (timeLeft <= 0) {
          productCard.style.pointerEvents = 'none'; // Kattintás letiltása
      }
  }, 1000);
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

function showProductDetails(title, description, imageUrl, price, bidStep, size, condition, brand) {
  // Létrehozzuk az overlay-t, hogy blokkolja a háttér kattintásait
  var overlay = document.createElement("div");
  overlay.classList.add("overlay");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "999"; // Alap modal mögé kerül
  overlay.style.pointerEvents = "all"; // Biztosítja, hogy ne lehessen átugrani az overlay-t

  // Létrehozzuk a modal-t
  var modal = document.createElement("div");
  modal.classList.add("modal");
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.width = "70%"; // Növelt szélesség
  modal.style.maxWidth = "600px"; // Maximális szélesség
  modal.style.backgroundColor = "#fff";
  modal.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.1)";
  modal.style.zIndex = "1000";
  modal.style.padding = "20px";
  modal.style.borderRadius = "15px";
  modal.style.overflow = "hidden";  // Nem szükséges görgetés
  modal.style.maxHeight = "110vh";  // Növelt maximális magasság
  modal.style.transition = "opacity 0.3s ease-in-out";
  
  var modalContent = document.createElement("div");

  modalContent.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="font-size: 1.8em; font-weight: bold; color: #333; margin-bottom: 15px;">${title}</h2>
        <!-- Kép kattintás esemény -->
        <img src="${imageUrl}" alt="${title}" class="product-image" style="width: 100%; height: 250px; border-radius: 15px; object-fit: cover; margin-top: 10px; cursor: pointer;" onclick="openImageModal('${imageUrl}')">
    </div>
    <div style="font-size: 1.2em; font-weight: normal; color: #555; margin-top: 10px;">
        <p><strong>Alap ár:</strong> <span id="originalPrice">${price} Ft</span></p>
        <p><strong>Licit lépcső:</strong> ${bidStep} Ft</p>
    </div>

    <!-- Kategória adatok -->
    <div style="font-size: 1.1em; color: #555; margin-top: 15px;">
        <p><strong>Méret:</strong> ${size || 'N/A'}</p>
        <p><strong>Állapot:</strong> ${condition || 'N/A'}</p>
        <p><strong>Márka:</strong> ${brand || 'N/A'}</p>
    </div>

    <div style="display: flex; justify-content: flex-start; align-items: center; margin-top: 20px;">
        <button onclick="increasePrice(${bidStep})" style="background-color: #bdc3c7; color: #fff; padding: 8px 12px; border-radius: 8px; border: none; font-size: 1.2em; cursor: pointer; transition: background-color 0.3s ease; display: flex; align-items: center;">
            <span style="font-size: 1.2em;">+</span>
        </button>
        <p id="bidAmount" style="font-size: 1.1em; color: #555; margin-left: 10px;">Aktuális ár: <span id="newPrice">${price} Ft</span></p>
    </div>

    <div style="font-size: 1em; color: #555; margin-top: 20px;">
        <label for="note" style="font-weight: bold;">Megjegyzés:</label>
        <textarea id="note" rows="5" style="width: 100%; resize: none; padding: 10px; margin-top: 10px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em; overflow-wrap: break-word; word-wrap: break-word; white-space: pre-wrap;" readonly>${description}</textarea>
    </div>

    <div style="display: flex; justify-content: center; margin-top: 20px;">
        <button onclick="closeModal()" style="background-color: #ecf0f1; color: #333; padding: 10px 15px; border-radius: 8px; border: 1px solid #ddd; font-size: 16px; width: 48%; cursor: pointer; transition: background-color 0.3s ease;">
            Bezárás
        </button>
    </div>
  `;

  modal.appendChild(modalContent);

  // A modal és az overlay hozzáadása a dokumentumhoz
  document.body.appendChild(overlay); // Overlay hozzáadása először
  document.body.appendChild(modal);   // Modal hozzáadása

  setTimeout(() => {
    modal.style.opacity = "1";
    overlay.style.opacity = "1";
    document.body.style.overflow = "hidden";
  }, 50);
}

// Kép modal funkció
function openImageModal(imageUrl) {
  var imageModal = document.createElement("div");
  imageModal.style.position = "fixed";
  imageModal.style.top = "0";
  imageModal.style.left = "0";
  imageModal.style.width = "100%";
  imageModal.style.height = "100%";
  imageModal.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  imageModal.style.zIndex = "2000";
  imageModal.style.display = "flex";
  imageModal.style.justifyContent = "center";
  imageModal.style.alignItems = "center";
  imageModal.style.cursor = "zoom-out";

  imageModal.innerHTML = `
      <img src="${imageUrl}" alt="Large Image" style="max-width: 90%; max-height: 90%; object-fit: contain; border-radius: 10px;">
  `;

  imageModal.onclick = function() {
      imageModal.remove();
  };

  document.body.appendChild(imageModal);
}



function increasePrice(bidStep) {
  var currentPrice = parseInt(document.getElementById("newPrice").textContent.replace(' Ft', ''));
  var newPrice = currentPrice + bidStep;
  document.getElementById("newPrice").textContent = newPrice + " Ft";
}

function closeModal() {
  var modal = document.querySelector(".modal");
  var overlay = document.querySelector(".overlay");

  if (modal && overlay) {
    modal.style.opacity = "0";
    overlay.style.opacity = "0";

    // Ez biztosítja, hogy egyszerre tűnjenek el
    setTimeout(() => {
      modal.remove();
      overlay.remove();
      document.body.style.overflow = "auto"; // Visszaállítja az oldalt a görgethetőségre
    }, 300); // Az animációval szinkronban eltávolítja
  }
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


