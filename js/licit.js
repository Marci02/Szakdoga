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
    
    <!-- Kategória választó -->
    <select id="fileCategory" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;" onchange="updateFormBasedOnCategory()">
      <option value="" disabled selected>Kategória kiválasztása</option>
      <option value="1">Ruhák</option>
      <option value="2">Cipők</option>
      <option value="3">Kiegészítők</option>
    </select>
    
    <!-- Dinamikus mezők itt fognak megjelenni -->
    <div id="dynamicFields"></div>
    
    <input type="text" id="fileBrand" placeholder="Márka" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">
    
    <!-- Licit vége mező -->
    <input type="datetime-local" id="fileBidEnd" style="width: 100%; padding: 10px; margin-bottom: 25px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;" placeholder="Licit vége">
    
    <!-- Gombok -->
    <div style="display: flex; justify-content: space-between;">
      <button onclick="DataUpload()" style="background-color: #22222a; color: white; padding: 12px 20px; border-radius: 8px; border: none; font-size: 16px; width: 48%; cursor: pointer; transition: background-color 0.3s ease;">
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

// Kategória alapján a dinamikus mezők frissítése
function updateFormBasedOnCategory() {
  const category = document.getElementById("fileCategory").value;
  const dynamicFields = document.getElementById("dynamicFields");

  // Töröljük az eddigi dinamikus mezőket
  dynamicFields.innerHTML = '';

  // Kategóriától függő mezők hozzáadása
  switch (category) {
    case "1": // Ruhák
      dynamicFields.innerHTML += `
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
      break;

    case "2": // Cipők
      dynamicFields.innerHTML += `
        <select id="fileSize" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">
          <option value="" disabled selected>Válassz méretet</option>
          ${Array.from({ length: 14 }, (_, i) => {
            const size = 35 + i;
            return `<option value="${size}">${size}</option>`;
          }).join('')}
        </select>
      `;
      break;

    case "3": // Kiegészítők
      // Itt nincs méret mező, semmi extra nem kell
      break;
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

// A fájl feltöltése és adatok küldése
function DataUpload() {
  const formData = new FormData();

  formData.append("name", document.getElementById("fileTitle").value);
  formData.append("price", parseInt(document.getElementById("filePrice").value) || 0);
  formData.append("stair", parseInt(document.getElementById("fileBidStep").value) || 0);
  formData.append("auction_end", document.getElementById("fileBidEnd").value);
  

  // Kategória és brand mindig számként küldése
  const category = document.getElementById("fileCategory").value;
  formData.append("fileCategory", category ? parseInt(category) : 0);

  const brand = document.getElementById("fileBrand").value;
  formData.append("fileBrand", brand ? parseInt(brand) : 0); // ❗ Ha nincs kiválasztva, akkor 0 lesz

  // Opcionális mezők
  const size = document.getElementById("fileSize");
  if (size) formData.append("fileSize", size.value);

  const condition = document.getElementById("fileCondition");
  if (condition) formData.append("fileCondition", condition.value);

  // Kép hozzáadása, ha van
  const fileInput = document.getElementById("fileInput");
  if (fileInput.files.length > 0) {
    formData.append("image", fileInput.files[0]);
  }

  // Debug log
  console.log("📤 Feltöltött adatok:");
  for (let pair of formData.entries()) {
    console.log(`${pair[0]}:`, pair[1]);
  }

  // Fetch POST küldés
  fetch("backend/licitupload.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("✅ Sikeres válasz:", data);
      if (data.status === "success") {
        alert("✅ A termék sikeresen feltöltve!");
        closeUploadModal();
      } else {
        alert("❌ Hiba: " + data.message);
      }
    })
    .catch((error) => {
      console.error("❌ Hiba történt:", error);
      alert("Hiba történt a feltöltés során!");
    });
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

function fetchAllAuctions() {
  fetch("backend/licitlekero.php")
    .then((response) => response.json())
    .then((data) => {
      console.log("🎯 Aukciók lekérve:", data);

      if (data.status === "success" && data.data.length > 0) {
        const productList = document.querySelector(".product-list");
        productList.innerHTML = ""; // Előző elemek törlése, ha újra betölt

        data.data.forEach((auction) => {
          const card = document.createElement("div");
          card.className = "product-card";
          card.style.borderRadius = "15px";
          card.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.1)";
          card.style.marginBottom = "20px";
          card.style.backgroundColor = "#fff";
          card.style.overflow = "hidden";
          card.style.cursor = "pointer";
          card.style.transition = "transform 0.3s ease-in-out";

          card.addEventListener("mouseover", function () {
            card.style.transform = "scale(1.05)";
          });
          card.addEventListener("mouseout", function () {
            card.style.transform = "scale(1)";
          });

          card.innerHTML = `
            <h3 style="font-size: 1.4em; font-weight: bold; color: #333; text-align: center; margin-top: 10px;">${auction.name}</h3>
            <div style="text-align: center; margin-bottom: 15px;">
              <img src="${auction.img_url}" alt="${auction.name}" class="product-image" style="width: 100%; height: 200px; object-fit: cover; border-radius: 15px;">
            </div>
            <div style="text-align: left">
              <div style="font-size: 1em; font-weight: bold; color: #555; margin-top: 10px;">
                <p><strong>Ár:</strong> ${auction.price} Ft</p>
              </div>
              <div class="product-info">
                <p><strong>Licit lépcső:</strong> ${auction.stair} Ft</p>
                <p><strong>Méret:</strong> ${auction.size || 'N/A'}</p>
                <p><strong>Állapot:</strong> ${auction.condition || 'N/A'}</p>
                <p><strong>Márka:</strong> ${auction.brand_name || 'N/A'}</p>
                <p><strong>Kategória:</strong> ${auction.category_name || 'N/A'}</p>
              </div>
              <div style="font-size: 1em; color: #e74c3c; margin-top: 15px;">
                <p><strong>Licit vége:</strong> <span class="countdown" id="countdown-${auction.auction_id}">Számolás...</span></p>
              </div>
            </div>
          `;

          

          productList.appendChild(card);
          card.addEventListener("click", function () {
            showProductDetails(auction);
          });

          // Ha van countdown funkciód
          if (typeof startCountdown === "function") {
            startCountdown(auction.auction_end, auction.auction_id, card);
          }
        });
      } else {
        console.warn("❗ Nincsenek aukciók.");
      }
    })
    .catch((error) => {
      console.error("❌ Hiba az aukciók lekérésekor:", error);
    });
}

// Indítás oldalbetöltéskor
window.addEventListener("DOMContentLoaded", function () {
  console.log("🔄 Oldal betöltve, aukciók lekérése...");
  fetchAllAuctions();
});

function createAuctionModal() {
  if (document.getElementById("auctionModal")) return; // Ne hozza létre többször

  const modal = document.createElement("div");
  modal.id = "auctionModal";
  modal.style.cssText = `
    display: none;
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.6);
  `;

  modal.innerHTML = `
    <div id="modalContent" style="
      background-color: white;
      margin: 5% auto;
      padding: 20px;
      border-radius: 20px;
      width: 80%;
      max-width: 600px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      position: relative;
    ">
      <span class="close" style="
        position: absolute;
        top: 15px;
        right: 25px;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
      ">&times;</span>
      <h2 id="modalTitle" style="text-align: center;"></h2>
      <img id="modalImage" src="" alt="" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 15px; margin: 20px 0; cursor: zoom-in;">
      <div id="modalDetails" style="font-size: 1em; color: #333;"></div>
      <button id="bidButton" style="
        display: block;
        margin: 20px auto 0;
        background-color: #27ae60;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 10px;
        font-size: 1em;
        cursor: pointer;
      ">Licitálok</button>
    </div>
  `;

  document.body.appendChild(modal);

  // Modal zárás gomb
  modal.querySelector(".close").onclick = () => {
    modal.style.display = "none";
  };

  // Külső kattintásra is zárja be
  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Kép nagyítás külön ablakban
  modal.querySelector("#modalImage").onclick = function () {
    const bigImg = window.open();
    bigImg.document.write(`<img src="${this.src}" style="width:100%">`);
  };
}


function showProductDetails(auction) {
  createAuctionModal(); // biztosan létrehozza, ha nincs

  const modal = document.getElementById("auctionModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalImage = document.getElementById("modalImage");
  const modalDetails = document.getElementById("modalDetails");
  const bidButton = document.getElementById("bidButton");

  modalTitle.textContent = auction.name;
  modalImage.src = auction.img_url;
  modalDetails.innerHTML = `
    <p><strong>Leírás:</strong> ${auction.description || 'Nincs leírás.'}</p>
    <p><strong>Jelenlegi ár:</strong> <span id="modalPrice">${auction.price}</span> Ft</p>
    <p><strong>Licit lépcső:</strong> ${auction.stair} Ft</p>
    <p><strong>Méret:</strong> ${auction.size || 'N/A'}</p>
    <p><strong>Állapot:</strong> ${auction.condition || 'N/A'}</p>
    <p><strong>Márka:</strong> ${auction.brand_name || 'N/A'}</p>
    <p><strong>Kategória:</strong> ${auction.category_name || 'N/A'}</p>
    <p><strong>Licit vége:</strong> ${auction.auction_end}</p>
  `;

  bidButton.onclick = function () {
    const priceEl = document.getElementById("modalPrice");
    let currentPrice = parseInt(priceEl.textContent);
    currentPrice += parseInt(auction.stair);
    priceEl.textContent = currentPrice;

    // Ide jöhetne egy fetch POST szerverre, ha szeretnél
    console.log(`🔼 Új licit: ${currentPrice} Ft`);
  };

  modal.style.display = "block";
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


