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
  modal.style.width = "70%";  // Reszponzív szélesség (90% a képernyő szélességéből)
  modal.style.maxWidth = "500px"; // Maximális szélesség (600px)
  modal.style.padding = "30px";  // Növelt padding
  modal.style.backgroundColor = "#fff";
  modal.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.3)";
  modal.style.borderRadius = "15px";
  modal.style.height = "870px";
  modal.style.zIndex = "1100";
  modal.style.textAlign = "center";
  modal.style.display = "block"; // Megjelenítés
  modal.style.overflowY = "auto";

  var modalContent = document.createElement("div");
  modalContent.innerHTML = `
    <h2 style="font-size: 1.8em; font-weight: bold; color: #222; margin-bottom: 20px;">Termék feltöltése</h2>

    <input type="text" id="fileTitle" placeholder="Termék címe" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">
    
    <input type="file" id="fileInput" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">
    
    <textarea id="fileDesc" rows="5" style="width: 100%; resize:none; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;" placeholder="Leírás"></textarea>
    
    <input type="number" id="filePrice" placeholder="Ár (Ft)" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">
    
    <input type="number" id="fileBidStep" placeholder="Licit lépcső (Ft)" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">
    
    <select id="fileCategory" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;" onchange="updateFormBasedOnCategory()">
      <option value="" disabled selected>Kategória kiválasztása</option>
      <option value="1">Ruhák</option>
      <option value="2">Cipők</option>
      <option value="3">Kiegészítők</option>
    </select>
    
    <div id="dynamicFields"></div>
    
    <input type="text" id="fileBrand" placeholder="Márka" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">
    
    <input type="datetime-local" id="fileBidEnd" style="width: 100%; padding: 10px; margin-bottom: 25px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;" placeholder="Licit vége">
    
    <div style="display: flex; flex-direction: column; gap: 10px; justify-content: center;">
      <button onclick="DataUpload()" style="background-color: #22222a; color: white; padding: 12px 20px; border-radius: 8px; border: none; font-size: 16px; cursor: pointer; transition: background-color 0.3s ease;">
        Feltöltés
      </button>
      
      <button onclick="closeUploadModal()" style="background-color: #ecf0f1; color: #333; padding: 12px 20px; border-radius: 8px; border: 1px solid #ddd; font-size: 16px; cursor: pointer; transition: background-color 0.3s ease;">
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

function updateFormBasedOnCategory() {
  const category = document.getElementById("fileCategory").value;
  const dynamicFields = document.getElementById("dynamicFields");

  dynamicFields.innerHTML = '';

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
      break;
  }

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

  const name = document.getElementById("fileTitle").value;
  const price = document.getElementById("filePrice").value;
  const stair = document.getElementById("fileBidStep").value;
  const category = document.getElementById("fileCategory").value;
  const brand = document.getElementById("fileBrand").value;
  const auction_end = document.getElementById("fileBidEnd").value;
  const image = document.getElementById("fileInput").files[0];
  const conditionInput = document.getElementById("fileCondition");
  const condition = conditionInput ? conditionInput.value : "";
  const sizeInput = document.getElementById("fileSize");
  const size = sizeInput ? sizeInput.value : "";
  const desc = document.getElementById("fileDesc").value;

  formData.append("name", name);
  formData.append("price", price);
  formData.append("stair", stair);
  formData.append("fileCategory", category);
  formData.append("fileBrand", brand);
  formData.append("auction_end", auction_end);
  formData.append("fileSize", size);
  formData.append("fileCondition", condition);
  formData.append("fileDesc", desc);
  if (image) {
      formData.append("image", image);
  }

  fetch("backend/licitupload.php", {
    method: "POST",
    body: formData,
})
.then(res => res.json())
.then(data => {
    console.log("Backend válasz:", data); // Ellenőrizd a konzolban a backend válaszát
    if (data.status === "success") {
        showMessage(data.message || "A termék sikeresen feltöltve!", 'success');
        closeUploadModal();
        fetchAllAuctions(); // Frissítjük a terméklistát
    } else {
        showMessage("Hiba történt a feltöltés során: " + (data.message || "Ismeretlen hiba"), 'error');
        closeUploadModal();
    }
})
.catch(error => {
    console.error("Hiba a feltöltés során:", error);
    showMessage("Hiba történt a feltöltés során.", 'error');
    closeUploadModal();
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
          card.className = "product-card card-appear";
          card.style.animation = "cardAppear 0.5s ease-out";
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

          // Frissített HTML, hogy az aktuális ár (ho) jelenjen meg
          card.innerHTML = `
            <h3 style="font-size: 1.4em; font-weight: bold; color: #333; text-align: center; margin-top: 10px;">${auction.name}</h3>
            <div style="text-align: center; margin-bottom: 15px;">
              <img src="${auction.img_url}" alt="${auction.name}" class="product-image" style="width: 100%; height: 200px; object-fit: cover; border-radius: 15px;">
            </div>
            <div style="text-align: left">
              <div style="font-size: 1em; font-weight: bold; color: #555; margin-top: 10px;">
              </div>
              <div class="product-info">
              <p>Licit lépcső: ${formatPrice(auction.stair)} Ft</p>
              <p>Méret: ${auction.size || 'N/A'}</p>
              </div>
              <p id="price-${auction.auction_id}">${formatPrice(auction.price)} Ft</p> <!-- Az aktuális ár (ho) jelenik meg -->
              <div style="font-size: 1em; color: #e74c3c; margin-top: 15px;">
              <p>Licit vége: <span class="countdown" id="countdown-${auction.auction_id}">Számolás...</span></p>
              </div>
            </div>
          `;

          // Kattintás esemény a részletek megjelenítéséhez
          card.addEventListener("click", function () {
            showProductDetails(
              auction.name,
              auction.description || "Nincs leírás.",
              auction.img_url,
              auction.price, // Az aktuális ár (ho)
              auction.stair,
              auction.size,
              auction.condition,
              auction.brand_name,
              auction.auction_id, // auctionId
              auction.user_id // userId
            );
          });

          productList.appendChild(card);

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

function formatPrice(price) {
  // Biztosítjuk, hogy a price string típusú legyen
  const cleanPrice = String(price).replace(/\D/g, '');  // A nem szám karaktereket eltávolítjuk
  // Visszafordítjuk a számot és szóközökkel tagoljuk
  const formattedPrice = cleanPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return formattedPrice;
}

// Indítás oldalbetöltéskor
window.addEventListener("DOMContentLoaded", function () {
  console.log("🔄 Oldal betöltve, aukciók lekérése...");
  fetchAllAuctions();
});

function showProductDetails(title, description, imageUrl, price, bidStep, size, condition, brand, auctionId, userId,) {
  // Ha már nyitva van modal, töröljük
  let existingModal = document.getElementById("productModalOverlay");
  if (existingModal) {
    existingModal.remove();
    document.body.style.overflow = "";
  }

  // Háttér scroll tiltása
  document.body.style.overflow = "hidden";

  // Háttér overlay
  const modalOverlay = document.createElement("div");
  modalOverlay.id = "productModalOverlay";
  modalOverlay.style.position = "fixed";
  modalOverlay.style.top = 0;
  modalOverlay.style.left = 0;
  modalOverlay.style.width = "100vw";
  modalOverlay.style.height = "100vh";
  modalOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  modalOverlay.style.display = "flex";
  modalOverlay.style.justifyContent = "center";
  modalOverlay.style.alignItems = "center";
  modalOverlay.style.zIndex = "9999";

  // Modal doboz
  const modal = document.createElement("div");
  modal.id = "productModal";
  modal.style.backgroundColor = "#fff";
  modal.style.borderRadius = "20px";
  modal.style.maxWidth = "500px";
  modal.style.width = "90%";
  modal.style.padding = "24px";
  modal.style.boxShadow = "0 20px 50px rgba(0,0,0,0.25)";
  modal.style.fontFamily = "Arial, sans-serif";
  modal.style.color = "#333";

  // Az aktuális ár frissítése a kártyáról
  const cardPriceElement = document.querySelector(`#price-${auctionId}`);
  const currentPrice = cardPriceElement
    ? parseInt(cardPriceElement.textContent.replace(/\D/g, ""))
    : price; // Ha nincs kártya, használjuk az eredeti árat

  // Tartalom beszúrása
  modal.innerHTML = `
    <h2 style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 16px;">
      ${title}
    </h2>

    <img src="${imageUrl}" alt="${title}" onclick="openImageModal('${imageUrl}')"
      style="width: 100%; max-height: 250px; object-fit: cover; border-radius: 12px; margin-bottom: 16px; cursor: pointer;">

    <p style="margin: 0; font-size: 17px;"><strong>Alapár:</strong> ${formatPrice(price)} Ft</p>
    <p><strong>Licit lépcső:</strong> ${formatPrice(bidStep)} Ft</p>
    <p><strong>Méret:</strong> ${size}</p>
    <p><strong>Állapot:</strong> ${condition}</p>
    <p><strong>Márka:</strong> ${brand}</p>
    
    <textarea id="note" rows="5" style="width: 100%; resize: none; padding: 10px; margin-top: 10px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em; overflow-wrap: break-word; word-wrap: break-word; white-space: pre-wrap;" readonly>${description}</textarea>
    
    <p style="margin: 0;  font-size: 20px; margin-top:10px;"><strong>Aktuális ár:</strong> <span id="highestPrice">${formatPrice(currentPrice)}</span> Ft</p>
    <div style="display: flex; gap: 12px; justify-content: space-between; margin-top: 12px;">
      <button onclick="increaseModalPrice(${bidStep}, ${auctionId}, ${userId})"
        style="flex: 1; padding: 12px 0; background-color: #000; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
        Licitálás
      </button>
      <button onclick="closeProductModal()"
        style="flex: 1; padding: 12px 0; background-color: #e5e7eb; color: #111827; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
        Bezárás
      </button>
    </div>
  `;

  // Hozzáadás a DOM-hoz
  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);
}


function closeProductModal() {
  const overlay = document.getElementById("productModalOverlay");
  const modal = document.getElementById("productModal");

  if (overlay && modal) {
    // Animáció az eltűnéshez
    overlay.style.opacity = "0";
    modal.style.opacity = "0";

    // Az elemek eltávolítása az animáció után
    setTimeout(() => {
      overlay.remove();
      modal.remove();
      document.body.style.overflow = "auto"; // Görgetés visszaállítása
    }, 300); // Az animáció időtartamával szinkronban
  }
}

function increaseModalPrice(bidStep, auctionId, userId) {
  console.log("Licitálás indítása:", { bidStep, auctionId, userId });

  const highestPriceElement = document.getElementById("highestPrice");
  const bidButton = document.querySelector(`button[onclick="increaseModalPrice(${bidStep}, ${auctionId}, ${userId})"]`);

  if (highestPriceElement && bidButton) {
    // Eltávolítjuk a nem szám karaktereket a jelenlegi árból
    let currentPrice = parseInt(highestPriceElement.textContent.replace(/\D/g, ""));
    console.log("Jelenlegi ár (currentPrice):", currentPrice);

    // Hozzáadjuk a licitlépcsőt
    currentPrice += bidStep;
    console.log("Új ár (currentPrice + bidStep):", currentPrice);

    // CSS animáció létrehozása
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes priceUpdate {
        0% {
          transform: translateY(100%);
          opacity: 0;
          color: green; /* Kezdő szín */
        }
        50% {
          transform: translateY(0);
          opacity: 1;
          color: green; /* Animáció közben zöld */
        }
        100% {
          transform: translateY(-100%);
          opacity: 0;
          color: inherit; /* Visszaáll az eredeti színre */
        }
      }
      .price-update {
        display: inline-block;
        animation: priceUpdate 0.5s ease-in-out;
      }
    `;
    document.head.appendChild(style);

    // Animáció az aktuális ár frissítéséhez
    highestPriceElement.classList.add("price-update");
    setTimeout(() => {
      highestPriceElement.textContent = `${currentPrice.toLocaleString()}`;
      highestPriceElement.classList.remove("price-update");
    }, 500); // Az animáció időtartamával szinkronban

    // Frissítjük a kártyán megjelenő árat
    const cardPriceElement = document.querySelector(`#price-${auctionId}`);
    if (cardPriceElement) {
      cardPriceElement.classList.add("price-update");
      setTimeout(() => {
        cardPriceElement.textContent = `${currentPrice.toLocaleString()} Ft`;
        cardPriceElement.classList.remove("price-update");
      }, 500); // Az animáció időtartamával szinkronban
    }

    // Letiltjuk a gombot, hogy ne lehessen többször kattintani
    bidButton.disabled = true;
    bidButton.style.cursor = "not-allowed";
    bidButton.style.opacity = "0.6";

    // Küldjük az adatokat a backendnek
    fetch("backend/updatePrice.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auctionId: auctionId,
        currentPrice: currentPrice,
        userId: userId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          console.log("Ár és felhasználó sikeresen frissítve az adatbázisban.");
        } else {
          console.error("Hiba történt az ár frissítésekor:", data.message);
          // Ha hiba történt, engedélyezzük újra a gombot
          bidButton.disabled = false;
          bidButton.style.cursor = "pointer";
          bidButton.style.opacity = "1";
        }
      })
      .catch((error) => {
        console.error("Hiba a backend kérés során:", error);
        // Ha hiba történt, engedélyezzük újra a gombot
        bidButton.disabled = false;
        bidButton.style.cursor = "pointer";
        bidButton.style.opacity = "1";
      });
  } else {
    console.error("Hiányzó elemek a licitáláshoz.");
  }
}

function openImageModal(imageUrl) {
  var imageModal = document.createElement("div");
  imageModal.style.position = "fixed";
  imageModal.style.top = "0";
  imageModal.style.left = "0";
  imageModal.style.width = "100%";
  imageModal.style.height = "100%";
  imageModal.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  imageModal.style.zIndex = "10000";
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

function showMessage(message, type = 'error', duration = 3000) {
  const messageBox = document.getElementById('message-box');
  if (!messageBox) {
      console.error("A 'message-box' elem nem található!");
      return;
  }

  messageBox.textContent = message;
  messageBox.className = `message-box ${type} show`;

  // Az üzenet eltüntetése a megadott idő után
  setTimeout(() => {
      messageBox.classList.remove('show');
  }, duration);
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


