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

function search() {
  if (!allProducts || allProducts.length === 0) {
    console.error("❌ A termékek még nem töltődtek be.");
    return;
  }

  const searchTerm = document.getElementById("search").value.toLowerCase();

  // Szűrjük az összes terméket a keresési kifejezés alapján
  filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm)
  );

  console.log("🔍 Keresési eredmények:", filteredProducts);

  // Ha nincs találat, üzenetet jelenítünk meg
  if (filteredProducts.length === 0) {
    const productList = document.querySelector(".product-list");
    productList.innerHTML = `<p style="text-align: center; color: #555;">Nincs találat a(z) "${searchTerm}" keresésre.</p>`;
    return;
  }

  // Lapozott termékek megjelenítése
  currentPage = 1; // Visszaállítjuk az első oldalra
  renderPaginatedProducts(filteredProducts);
}

function showSearchResultsPopup(products) {
  // Remove any existing popup
  const existingPopup = document.getElementById("searchResultsPopup");
  if (existingPopup) {
      existingPopup.remove();
  }

  // Get the search bar element
  const searchBar = document.getElementById("search");
  const searchBarRect = searchBar.getBoundingClientRect();

  // Create the popup container
  const popup = document.createElement("div");
  popup.id = "searchResultsPopup";
  popup.style.position = "absolute";
  popup.style.top = `${searchBarRect.bottom + window.scrollY + 10}px`; // Position below the search bar
  popup.style.left = `${searchBarRect.left + window.scrollX}px`; // Align with the search bar
  popup.style.width = `${searchBar.offsetWidth}px`; // Match the search bar's width
  popup.style.backgroundColor = "#fff";
  popup.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.3)";
  popup.style.borderRadius = "10px";
  popup.style.padding = "10px";
  popup.style.zIndex = "1000";
  popup.style.overflowY = "auto";
  popup.style.maxHeight = "300px";

  // Add a close button
  const closeButton = document.createElement("button");
  closeButton.textContent = "Bezárás";
  closeButton.style.display = "block";
  closeButton.style.margin = "10px auto";
  closeButton.style.backgroundColor = "#22222a";
  closeButton.style.color = "#fff";
  closeButton.style.border = "none";
  closeButton.style.borderRadius = "5px";
  closeButton.style.padding = "5px 10px";
  closeButton.style.cursor = "pointer";
  closeButton.addEventListener("click", () => popup.remove());
  popup.appendChild(closeButton);

  // Add the search results
  if (products.length > 0) {
      products.forEach(product => {
          const productCard = document.createElement("a");
          productCard.href = `ossztermek.html?id=${product.id}`; // Redirect to the product page with the product ID
          productCard.style.textDecoration = "none";
          productCard.style.color = "inherit";

          productCard.style.border = "1px solid #ddd";
          productCard.style.borderRadius = "5px";
          productCard.style.marginBottom = "10px";
          productCard.style.padding = "10px";
          productCard.style.display = "flex";
          productCard.style.alignItems = "center";

          productCard.innerHTML = `
                  <h3 style="font-size: 1.4em; font-weight: bold; color: #333; text-align: center; margin-top: 10px;">${auction.name}</h3>
            <div style="text-align: center; margin-bottom: 15px;">
              <img src="${auction.img_url}" alt="${auction.name}" class="product-image" style="width: 100%; height: 200px; object-fit: cover; border-radius: 15px;">
            </div>
            <div style="text-align: left">
              <div class="product-info">
                <p id="price-${auction.auction_id}" style="font-size: 1.3em;"> 
                  ${formatPrice(auction.price)} Ft
                </p>
                <p style="font-size: 1em;">Licit lépcső: ${formatPrice(auction.stair)} Ft</p>
                <p>Méret: ${auction.size || 'N/A'}</p>
              </div>
              <div style="font-size: 1em; color: #e74c3c; margin-top: 15px;">
                <p>Licit vége: <span class="countdown" id="countdown-${auction.auction_id}">Számolás...</span></p>
              </div>
            </div>
          `;

          popup.appendChild(productCard);
      });
  } else {
      const noResults = document.createElement("p");
      noResults.textContent = "Nincs találat.";
      noResults.style.textAlign = "center";
      noResults.style.color = "#555";
      popup.appendChild(noResults);
  }

  // Append the popup to the body
  document.body.appendChild(popup);
}

let allProducts = []; // Az összes termék tárolása
let filteredProducts = []; // A szűrt termékek tárolása
let currentPage = 1; // Az aktuális oldal
const itemsPerPage = 8; // Oldalankénti termékek száma

function renderPaginatedProducts(products, loggedInUserId) {
  const productList = document.querySelector(".product-list");
  productList.innerHTML = ""; // Töröljük az előző termékeket

  // Számítsuk ki az aktuális oldalhoz tartozó termékeket
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  // Ha nincsenek termékek az aktuális oldalon
  if (paginatedProducts.length === 0) {
    productList.innerHTML = "<p>Nincs találat a szűrési feltételek alapján.</p>";
    return;
  }

  // Megjelenítjük az aktuális oldal termékeit
  paginatedProducts.forEach(auction => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.style.border = "1px solid #ddd";
    productCard.style.borderRadius = "15px";
    productCard.style.padding = "15px";
    productCard.style.marginBottom = "20px";
    productCard.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";
    productCard.style.backgroundColor = "#fff";
    productCard.style.cursor = "pointer"; // Mutatja, hogy kattintható

    productCard.innerHTML = `
      <h3 style="font-size: 1.4em; font-weight: bold; color: #333; text-align: center; margin-top: 10px;">${auction.name}</h3>
      <div style="text-align: center; margin-bottom: 15px;">
        <img src="${auction.img_url}" alt="${auction.name}" class="product-image" style="width: 100%; height: 200px; object-fit: cover; border-radius: 15px;">
      </div>
      <div style="text-align: left">
        <div class="product-info">
          <p id="price-${auction.auction_id}" style="font-size: 1.3em;"> 
            ${formatPrice(auction.price)} Ft
          </p>
          <p style="font-size: 1em;">Licit lépcső: ${formatPrice(auction.stair)} Ft</p>
          <p>Méret: ${auction.size || 'N/A'}</p>
        </div>
        <div style="font-size: 1em; color: #e74c3c; margin-top: 15px;">
          <p>Licit vége: <span class="countdown" id="countdown-${auction.auction_id}">Számolás...</span></p>
        </div>
      </div>
    `;

    // Eseménykezelő hozzáadása a kártyához
    productCard.addEventListener("click", () => {
      showProductDetails(
        auction.name,
        auction.description || "Nincs leírás.",
        auction.img_url,
        auction.original_price,
        auction.price, // Az aktuális ár (ho)
        auction.stair,
        auction.size,
        auction.condition,
        auction.brand_name,
        auction.auction_id, // auctionId
        loggedInUserId, // userId
        auction.owner_id,
        auction.ho_id
      );
    });

    productList.appendChild(productCard);

    // Indítsuk el a visszaszámlálást
    startCountdown(auction.auction_end, auction.auction_id);
  });

  // Frissítjük a lapozási információkat
  updatePaginationInfo(products.length);
}

function updatePaginationInfo(totalItems) {
  const paginationInfo = document.getElementById("pagination-info");
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  paginationInfo.textContent = `Oldal ${currentPage} / ${totalPages}`;

  // Lapozási gombok engedélyezése/letiltása
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;
}

document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderPaginatedProducts(filteredProducts.length ? filteredProducts : allProducts);
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  const totalPages = Math.ceil((filteredProducts.length ? filteredProducts : allProducts).length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderPaginatedProducts(filteredProducts.length ? filteredProducts : allProducts);
  }
});

function fetchProducts() {
  fetch("backend/licitlekero.php")
    .then(response => response.json())
    .then(data => {
      if (data.status === "success" && Array.isArray(data.data)) {
        allProducts = data.data; // Store all products in the global array
        renderPaginatedProducts(allProducts); // Render paginated products initially
      } else {
        console.error("Hiba: Nem sikerült lekérni a termékeket.");
      }
    })
    .catch(error => console.error("Hiba a termékek lekérésekor:", error));
}
document.addEventListener("DOMContentLoaded", fetchProducts);

document.getElementById("searchbuttonToSearchBar").addEventListener("click", search);

document.getElementById("search").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    search();
  }
});

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
  modal.style.width = "80%";  // Reszponzív szélesség (90% a képernyő szélességéből)
  modal.style.maxWidth = "500px";
  modal.style.maxHeight = "90vh"; 
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


function startCountdown(bidEndTime, auctionId) {
  const countdownElement = document.getElementById("countdown-" + auctionId);
  const endTime = new Date(bidEndTime).getTime();

  const interval = setInterval(function () {
    const now = new Date().getTime();
    const timeLeft = endTime - now;

    if (timeLeft <= 0) {
      clearInterval(interval);
      countdownElement.innerHTML = "Licit vége";

      // Küldés a backendnek, hogy a terméket hozzáadja a sales táblához
      fetch("backend/licitLejart.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auction_id: auctionId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            console.log(data.message);
          } else {
            console.error(data.error);
          }
        })
        .catch((error) => {
          console.error("Hiba a licit lejáratának kezelése során:", error);
        });
    } else {
      const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
      const seconds = Math.floor((timeLeft / 1000) % 60);
      countdownElement.innerHTML = `${hours} óra ${minutes} perc ${seconds} másodperc`;
    }
  }, 1000);
}

let loggedInUserId; // Globális változó a bejelentkezett felhasználó ID-jához

function fetchAllAuctions() {
  fetch("backend/licitlekero.php")
    .then(response => response.json())
    .then(data => {
      console.log("🎯 Backend válasz:", data);

      if (data.status === "success" && Array.isArray(data.data)) {
        allProducts = data.data; // Az összes termék tárolása
        loggedInUserId = data.loggedInUserId; // Bejelentkezett felhasználó ID-jának tárolása
        renderPaginatedProducts(allProducts, loggedInUserId); // Lapozott termékek megjelenítése
      } else {
        console.warn("❗ Nincsenek aukciók.");
        const productList = document.querySelector(".product-list");
        productList.innerHTML = "<p>Nincs találat a szűrési feltételek alapján.</p>";
      }
    })
    .catch(error => {
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
  fetchAllAuctions(); // Alapértelmezett betöltés

  // Szűrési események hozzáadása
  document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderPaginatedProducts(filteredProducts.length ? filteredProducts : allProducts);
    }
  });
  
  document.getElementById("nextPage").addEventListener("click", () => {
    const totalPages = Math.ceil((filteredProducts.length ? filteredProducts : allProducts).length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderPaginatedProducts(filteredProducts.length ? filteredProducts : allProducts);
    }
  });
});

function showProductDetails(title, description, imageUrl, originalPrice, price, bidStep, size, condition, brand, auctionId, userId, owner_id, ho_id) {
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
  modal.style.maxHeight = "90vh";
  modal.style.overflowY = "auto";
  modal.style.padding = "24px";
  modal.style.boxShadow = "0 20px 50px rgba(0,0,0,0.25)";
  modal.style.fontFamily = "Arial, sans-serif";
  modal.style.color = "#333";

  // Tartalom beszúrása
  modal.innerHTML = `
    <h2 style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 16px;">
      ${title}
    </h2>

    <img src="${imageUrl}" alt="${title}" onclick="openImageModal('${imageUrl}')"
      style="width: 100%; max-height: 250px; object-fit: cover; border-radius: 12px; margin-bottom: 16px; cursor: pointer;">

    <p style="margin: 0; font-size: 17px;"><strong>Alapár:</strong> ${formatPrice(originalPrice)} Ft</p>
    <p><strong>Licit lépcső:</strong> ${formatPrice(bidStep)} Ft</p>
    <p><strong>Méret:</strong> ${size}</p>
    <p><strong>Állapot:</strong> ${condition}</p>
    <p><strong>Márka:</strong> ${brand}</p>
    
    <textarea id="note" rows="5" style="width: 100%; resize: none; padding: 10px; margin-top: 10px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em; overflow-wrap: break-word; word-wrap: break-word; white-space: pre-wrap;" readonly>${description}</textarea>
    
    <p style="margin: 0; font-size: 20px; margin-top:10px;"><strong>Aktuális ár:</strong> <span id="highestPrice">${formatPrice(price)}</span> Ft</p>
    <div style="display: flex; gap: 12px; justify-content: space-between; margin-top: 12px;">
      <button id="bidButton" onclick="increaseModalPrice(${bidStep}, ${auctionId}, ${userId})"
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

  // Ellenőrzés: a felhasználó a legmagasabb licitáló-e vagy a termék feltöltője-e
  const isOwner = parseInt(userId) === parseInt(owner_id);
  const isHighestBidder = parseInt(userId) === parseInt(ho_id);
  console.log("isOwner:", isOwner, "isHighestBidder:", isHighestBidder, "userId:", userId, "ownerId:", owner_id, "ho_id:", ho_id);

  const bidButton = modal.querySelector("#bidButton");
  if (isOwner && bidButton) {
    bidButton.disabled = true;
    bidButton.style.cursor = "not-allowed";
    bidButton.style.opacity = "0.6";
    bidButton.textContent = "Nem licitálhatsz a saját termékedre";
  } else if (isHighestBidder && bidButton) {
    bidButton.disabled = true;
    bidButton.style.cursor = "not-allowed";
    bidButton.style.opacity = "0.6";
    bidButton.textContent = "Tied a legmagasabb licit";
  } else if (!bidButton) {
    console.error("A 'bidButton' elem nem található!");
  }
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

          // Frissítjük az aktuális árat a modalban
          highestPriceElement.textContent = `${data.updatedPrice.toLocaleString()} Ft`;

          // Frissítjük a kártyán megjelenő árat
          const cardPriceElement = document.querySelector(`#price-${auctionId}`);
          if (cardPriceElement) {
            cardPriceElement.textContent = `${data.updatedPrice.toLocaleString()} Ft`;
          }

          // Ellenőrizzük, hogy a felhasználó lett-e a legmagasabb licitáló
          if (data.newHighestBidderId === userId) {
            bidButton.disabled = true;
            bidButton.style.cursor = "not-allowed";
            bidButton.style.opacity = "0.6";
            bidButton.textContent = "Tied a legmagasabb licit";
          }
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


// Kép modal funkció
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


function applyFilters(loggedInUserId) {
  const selectedCategories = [];
  const selectedBrands = [];
  const selectedSizes = [];
  const selectedConditions = [];
  const selectedPrice = document.getElementById("price-range").value;

  // Kategóriák kiválasztása
  document.querySelectorAll("#category1 input[type='checkbox']").forEach(checkbox => {
    if (checkbox.checked) {
      selectedCategories.push(checkbox.parentElement.textContent.trim().toLowerCase());
    }
  });

  // Márkák kiválasztása
  document.querySelectorAll("#brand input[type='checkbox']").forEach(checkbox => {
    if (checkbox.checked) {
      selectedBrands.push(checkbox.parentElement.textContent.trim().toLowerCase());
    }
  });

  // Méretek kiválasztása
  document.querySelectorAll("#size input[type='checkbox']").forEach(checkbox => {
    if (checkbox.checked) {
      selectedSizes.push(checkbox.value.toLowerCase());
    }
  });

  // Állapotok kiválasztása
  document.querySelectorAll("#condition input[type='checkbox']").forEach(checkbox => {
    if (checkbox.checked) {
      selectedConditions.push(checkbox.parentElement.textContent.trim().toLowerCase());
    }
  });

  console.log("🔍 Szűrési feltételek:", {
    categories: selectedCategories,
    brands: selectedBrands,
    sizes: selectedSizes,
    conditions: selectedConditions,
    price: selectedPrice
  });

  // Szűrési feltételek alkalmazása
  filteredProducts = allProducts.filter(product => {
    const matchesCategory = !selectedCategories.length || selectedCategories.includes(product.category_name.toLowerCase());
    const matchesBrand = !selectedBrands.length || selectedBrands.includes(product.brand_name.toLowerCase());
    const matchesSize = !selectedSizes.length || selectedSizes.includes(product.size.toLowerCase());
    const matchesCondition = !selectedConditions.length || selectedConditions.includes(product.condition.toLowerCase());
    const matchesPrice = !selectedPrice || parseInt(product.price) >= parseInt(selectedPrice);

    return matchesCategory && matchesBrand && matchesSize && matchesCondition && matchesPrice;
  });

  console.log("🔍 Szűrt termékek:", filteredProducts);

  // Lapozott termékek megjelenítése
  currentPage = 1; // Visszaállítjuk az első oldalra
  renderPaginatedProducts(filteredProducts, loggedInUserId);
}

window.addEventListener("DOMContentLoaded", function () {
  console.log("🔄 Oldal betöltve, aukciók lekérése...");
  fetchAllAuctions(); // Alapértelmezett betöltés

  // Szűrési események hozzáadása
  document.querySelectorAll("#category1 input[type='checkbox'], #brand input[type='checkbox'], #size input[type='checkbox'], #condition input[type='checkbox']").forEach(checkbox => {
    checkbox.addEventListener("change", () => applyFilters(loggedInUserId));
  });

  document.getElementById("price-range").addEventListener("input", () => {
    document.getElementById("price-value").textContent = `${document.getElementById("price-range").value} Ft`;
    applyFilters(loggedInUserId);
  });
});

function updatePriceValue() {
  const priceRange = document.getElementById("price-range");
  const priceValue = document.getElementById("price-value");

  if (priceRange && priceValue) {
    priceValue.textContent = `${priceRange.value} Ft`;
  } else {
    console.error("Nem található a 'price-range' vagy 'price-value' elem!");
  }
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



