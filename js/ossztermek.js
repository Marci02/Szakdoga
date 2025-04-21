function stickyNav() {
  const navbar = document.querySelector("nav");
  const headerHeight = document.querySelector(".container").offsetHeight / 2;
  const scrollValue = window.scrollY;

  navbar.classList.toggle("header-sticky", scrollValue > headerHeight);
}
window.addEventListener("scroll", stickyNav);

let allProducts = [];

function search() {
  const searchTerm = document.getElementById("search").value.toLowerCase();
  const products = document.querySelectorAll(".product-card");

  let found = false;

  products.forEach(product => {
    const name = product.dataset.productName.toLowerCase();
    if (name.includes(searchTerm)) {
      product.style.display = "block";
      found = true;
    } else {
      product.style.display = "none";
    }
  });

  const output = document.getElementById("output");
  output.textContent = found ? "" : `Nincs találat a(z) "${searchTerm}" keresésre.`;
}

function toggleSearch() {
  const searchBtn = document.getElementById("searchBtn");
  searchBtn.style.display = searchBtn.style.display === "none" ? "block" : "none";
}

function renderProducts(products) {
  let productList = document.querySelector(".product-list");
  productList.innerHTML = "";

  products.forEach(product => {
    let productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.dataset.productId = product.id;
    productCard.dataset.productName = product.name;
    productCard.dataset.productDescription = product.description;
    productCard.dataset.productPrice = product.price;
    productCard.dataset.productSize = product.size || "N/A";
    productCard.dataset.productCondition = product.condition || "N/A";
    productCard.dataset.productImage = product.img_url;
    productCard.dataset.productBrand = product.brand_name || "Ismeretlen";
    productCard.dataset.productCategory = product.category_name || "Ismeretlen";

    const formattedPrice = formatPrice(product.price);

    productCard.innerHTML = `
      <img src="${product.img_url}" alt="${product.name}" class="product-image">
      <h3>${product.name}</h3>
      <p>Méret: ${product.size || "N/A"}</p>
      <p>Állapot: ${product.condition || "N/A"}</p>
      <p id="price">${formattedPrice} Ft</p>
    `;

    productCard.addEventListener("click", function () {
      openProductModal(this);
    });

    productList.appendChild(productCard);
  });
}

document.getElementById("search").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    search();
  }
});

document.getElementById("searchBtn").style.display = "none";
document.getElementById("cartBtn").style.display = "none";

const cartBtn = document.getElementById("cartBtn");
cartBtn.parentElement.addEventListener("mouseenter", () => cartBtn.style.display = "block");
cartBtn.parentElement.addEventListener("mouseleave", () => cartBtn.style.display = "none");

function openUploadModal() {
  const modal = createModal();
  document.body.appendChild(modal.modal);
  document.body.appendChild(modal.overlay);
  document.body.style.overflow = "hidden";

  setTimeout(() => {
    modal.modal.style.opacity = "1";
    modal.overlay.style.opacity = "1";
  }, 50);
}

function createModal() {
  const modal = document.createElement("div");
  modal.id = "uploadModal";
  modal.style.cssText = `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 400px; padding: 30px; background-color: #fff; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); border-radius: 15px; z-index: 1000; opacity: 0; text-align: center;`;
  
  modal.innerHTML = `
    <h2 style="font-size: 1.8em; font-weight: bold; color: #222; margin-bottom: 20px;">Termék feltöltése</h2>
    <input type="text" id="fileTitle" placeholder="Termék címe" maxlength="20" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd;">
    <input type="file" id="fileInput" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd;">
    <textarea id="fileDesc" rows="5" style="width: 100%; resize:none; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd;" placeholder="Leírás"></textarea>
    <input type="number" id="filePrice" placeholder="Ár (Ft)" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd;">
    <select id="fileCategory" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd;" onchange="updateFormBasedOnCategory()">
      <option value="" disabled selected>Kategória kiválasztása</option>
      <option value="ruhák">Ruhák</option>
      <option value="cipők">Cipők</option>
      <option value="kiegészítők">Kiegészítők</option>
    </select>
    <div id="dynamicFields"></div>
    <input type="text" id="fileBrand" placeholder="Márka" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd;">
    <div id="upload" style="display: flex; justify-content: space-between;">
      <button onclick="uploadFile()" style="background-color: #22222a; color: white; padding: 12px 20px; border-radius: 8px; width: 48%;">Feltöltés</button>
      <button onclick="closeUploadModal()" style="background-color: #ecf0f1; color: #333; padding: 12px 20px; border-radius: 8px; width: 48%;">Mégse</button>
    </div>`;

  const overlay = document.createElement("div");
  overlay.id = "modalOverlay";
  overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 999; opacity: 0; transition: opacity 0.3s ease-in-out;`;

  return { modal, overlay };
}

function updateFormBasedOnCategory() {
  const category = document.getElementById("fileCategory").value;
  const dynamicFields = document.getElementById("dynamicFields");

  dynamicFields.innerHTML = getDynamicFieldsForCategory(category);
}

function getDynamicFieldsForCategory(category) {
  const sizeOptions = {
    'cipők': `<option value="" disabled selected>Válassz méretet</option>
               <option value="35">35</option><option value="36">36</option><option value="37">37</option><option value="38">38</option>
               <option value="39">39</option><option value="40">40</option><option value="41">41</option><option value="42">42</option>
               <option value="43">43</option><option value="44">44</option><option value="45">45</option><option value="46">46</option><option value="47">47</option>
               <option value="48">48</option>`,
    'ruhák': `<option value="" disabled selected>Válassz méretet</option><option value="XS">XS</option><option value="S">S</option><option value="M">M</option><option value="L">L</option>
              <option value="XL">XL</option><option value="XXL">XXL</option>`,
    'kiegészítők': '',
  };

  return `
    <select id="fileSize" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd;">${sizeOptions[category] || ''}</select>
    <select id="fileCondition" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd;">
      <option value="" disabled selected>Válassz állapotot</option>
      <option value="Új">Új</option><option value="Újszerű">Újszerű</option><option value="Használt">Használt</option><option value="Nagyon használt">Nagyon használt</option>
    </select>`;
}

function closeUploadModal() {
  const modal = document.getElementById("uploadModal");
  const overlay = document.getElementById("modalOverlay");

  modal.style.opacity = "0";
  overlay.style.opacity = "0";

  setTimeout(() => {
    modal.remove();
    overlay.remove();
    document.body.style.overflow = "auto";
  }, 300);
}

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (productId) {
    fetch(`backend/getProduct.php?id=${productId}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const product = data.product;
          document.getElementById("product-name").textContent = product.name;
          document.getElementById("product-price").textContent = `${formatPrice(product.price)} Ft`;
          document.getElementById("product-description").textContent = product.description;
          document.getElementById("product-image").src = product.img_url;
        } else {
          console.error("Hiba: Nem sikerült lekérni a termék adatait.");
        }
      })
      .catch(error => console.error("Hiba a termék lekérésekor:", error));
  }
});

function uploadFile() {
  const fileInput = document.querySelector("#fileInput");
  const fileTitle = document.querySelector("#fileTitle").value;
  const fileDesc = document.querySelector("#fileDesc").value;
  const filePrice = document.querySelector("#filePrice").value;
  const fileCategory = document.querySelector("#fileCategory").value;
  const fileBrand = document.querySelector("#fileBrand").value;
  const fileCondition = document.querySelector("#fileCondition").value;
  const fileSize = document.querySelector("#fileSize").value || "";

  if (!fileInput.files.length) {
      showMessage("Kérjük, válasszon ki egy fájlt a feltöltéshez!", 'error');
      return;
  }

  let formData = new FormData();
  formData.append("image", fileInput.files[0]);
  formData.append("name", fileTitle);
  formData.append("description", fileDesc);
  formData.append("price", filePrice);
  formData.append("quantity", 1);
  formData.append("brand_id", fileBrand);
  formData.append("condition", fileCondition);
  formData.append("size", fileSize);
  formData.append("category_id", fileCategory);

  fetch("backend/ossztermekupload.php", {
      method: "POST",
      body: formData
  })
  .then(response => response.json())
  .then(data => {
      console.log("Szerver válasza:", data);
      if (data.success) {
          showMessage("Sikeres feltöltés!", 'success');
          closeUploadModal();
          fetchProducts();
      } else {
          showMessage("Hiba: " + data.message, 'error');
      }
  })
  .catch(error => {
      console.error("Hiba a feltöltés során:", error);
      showMessage("Hiba történt a fájl feltöltésekor.", 'error');
  });
}

document.addEventListener("DOMContentLoaded", fetchProducts);

function formatPrice(price) {
  // Biztosítjuk, hogy a price string típusú legyen
  const cleanPrice = String(price).replace(/\D/g, '');  // A nem szám karaktereket eltávolítjuk
  // Visszafordítjuk a számot és szóközökkel tagoljuk
  const formattedPrice = cleanPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return formattedPrice;
}

function fetchProducts() {
  fetch("backend/ossztermeklekero.php")
    .then(response => response.json())
    .then(data => {
      console.log("Lekért adatok:", data);

      if (!data || typeof data !== "object" || !Array.isArray(data.products)) {
        console.error("Hiba: A visszakapott adat nem megfelelő formátumú!", data);
        return;
      }

      allProducts = data.products; // Mentjük az összes terméket

      renderProducts(allProducts);

      let productList = document.querySelector(".product-list");
      productList.innerHTML = "";

      data.products.forEach(product => {
        let productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.dataset.productId = product.id;
        productCard.dataset.productName = product.name;
        productCard.dataset.productDescription = product.description;
        productCard.dataset.productPrice = product.price;
        productCard.dataset.productSize = product.size || "N/A";
        productCard.dataset.productCondition = product.condition || "N/A";
        productCard.dataset.productImage = product.img_url;
        productCard.dataset.productBrand = product.brand_name || "Ismeretlen";
        productCard.dataset.productCategory = product.category_name || "Ismeretlen";

        // Formázzuk az árat a szóközökkel tagolt verzióra
        const formattedPrice = formatPrice(product.price);

        productCard.innerHTML = `
          <img src="${product.img_url}" alt="${product.name}" class="product-image">
          <h3>${product.name}</h3>
          <p>Méret: ${product.size || "N/A"}</p>
          <p>Állapot: ${product.condition || "N/A"}</p>
          <p id="price">${formattedPrice} Ft</p>
        `;

        productList.appendChild(productCard);
      });

      document.querySelectorAll(".product-card").forEach(card => {
        card.addEventListener("click", function () {
          openProductModal(this);
        });
      });
    })
    .catch(error => console.error("Hiba a termékek lekérésekor:", error));
}



function openProductModal(card) {
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

  // Tartalom beszúrása
  modal.innerHTML = `
    <h2 style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 16px;">
      ${card.dataset.productName}
    </h2>

    <img src="${card.dataset.productImage}" alt="${card.dataset.productName}"
      style="width: 100%; max-height: 250px; object-fit: cover; border-radius: 12px; margin-bottom: 16px;">

      
      <h3 style="margin: 12px 0;"><strong>Ár:</strong> ${formatPrice(card.dataset.productPrice)} Ft</h3>
      <p><strong>Méret:</strong> ${card.dataset.productSize}</p>
      <p><strong>Állapot:</strong> ${card.dataset.productCondition}</p>

      <p><strong>Márka:</strong> ${card.dataset.productBrand}</p>

      <p><strong>Kategória:</strong> ${card.dataset.productCategory}</p>

      
      <textarea id="note" rows="5" style="width: 100%; resize: none; padding: 10px; margin-top: 10px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em; overflow-wrap: break-word; word-wrap: break-word; white-space: pre-wrap;" readonly>${card.dataset.productDescription}</textarea>
      <div style="display: flex; gap: 12px; justify-content: space-between; margin-top: 24px;">
      <button onclick="addToCart(${card.dataset.productId})"
      style="flex: 1; padding: 12px 0; background-color: #4b5563; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
      Kosárba
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

function addToCart(productId) {
  const card = document.querySelector(`.product-card[data-product-id="${productId}"]`);
  if (!card) {
      console.error("Termékkártya nem található.");
      showMessage("Hiba: Termékkártya nem található.", 'error');
      return;
  }

  // Lekérjük a termék eladójának azonosítóját
  fetch(`backend/get_saler_id.php?product_id=${productId}`)
      .then(response => response.json())
      .then(data => {
          if (!data || !data.saler_id) {
              throw new Error("Nem sikerült lekérni az eladó adatait.");
          }

          const salerId = data.saler_id;
          const buyerId = parseInt(document.body.dataset.userId); // A bejelentkezett felhasználó ID-ja (feltételezve, hogy a body tartalmazza)

          // Ellenőrizzük, hogy a termék eladója nem egyezik-e meg a bejelentkezett felhasználóval
          if (salerId === buyerId) {
              showMessage("Nem adhatod hozzá a saját termékedet a kosárhoz.", 'error');
              return;
          }

          // Ha nem saját termék, folytatjuk a kosárhoz adást
          const payload = {
              product_id: productId,
              saler_id: salerId,
              quantity: 1
          };

          return fetch("backend/kosarhozad.php", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(payload)
          });
      })
      .then(response => response.json())
      .then(result => {
          if (result.success) {
              showMessage("A termék sikeresen hozzáadva a kosárhoz!", 'success');
              closeProductModal();
          } else {
              showMessage("Hiba a kosárhoz adás során: " + (result.error || "Ismeretlen hiba"), 'error');
              closeProductModal();
          }
      })
      .catch(error => {
          console.error("Hiba:", error);
          showMessage("Hiba történt a művelet során.", 'error');
      });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();

  document.getElementById("searchbuttonToSearchBar").addEventListener("click", search);
});

function closeProductModal() {
  const overlay = document.getElementById("productModalOverlay");
  if (overlay) {
    overlay.remove();
    document.body.style.overflow = ""; // Re-enable scroll
  }
}

function toggleCategory(categoryId) {
  let category = document.getElementById(categoryId);
  
  if (category.style.display === "block") {
      category.style.display = "none";
  } else {
      category.style.display = "block";
  }
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