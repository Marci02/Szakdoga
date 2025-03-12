// Sticky navigation on scroll
function stickyNav() {
  const navbar = document.querySelector("nav");
  const headerHeight = document.querySelector(".container").offsetHeight / 2;
  const scrollValue = window.scrollY;

  navbar.classList.toggle("header-sticky", scrollValue > headerHeight);
}
window.addEventListener("scroll", stickyNav);

// Search functionality
function search() {
  const searchTerm = document.getElementById('search').value;
  const output = document.getElementById('output');
  
  const messages = {
    'apple': 'Search term matched: apple',
    'banana': 'Search term matched: banana',
  };

  output.innerHTML = messages[searchTerm] || `No matching result for the search term: ${searchTerm}`;
}

// Toggle search button visibility
function toggleSearch() {
  const searchBtn = document.getElementById("searchBtn");
  searchBtn.style.display = searchBtn.style.display === "none" ? "block" : "none";
}

document.getElementById("searchBtn").style.display = "none";
document.getElementById("cartBtn").style.display = "none";

// Cart button hover effect
const cartBtn = document.getElementById("cartBtn");
cartBtn.parentElement.addEventListener("mouseenter", () => cartBtn.style.display = "block");
cartBtn.parentElement.addEventListener("mouseleave", () => cartBtn.style.display = "none");

// Open upload modal
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

// Create upload modal elements
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
    <div style="display: flex; justify-content: space-between;">
      <button onclick="uploadFile()" style="background-color: #22222a; color: white; padding: 12px 20px; border-radius: 8px; width: 48%;">Feltöltés</button>
      <button onclick="closeUploadModal()" style="background-color: #ecf0f1; color: #333; padding: 12px 20px; border-radius: 8px; width: 48%;">Mégse</button>
    </div>`;

  const overlay = document.createElement("div");
  overlay.id = "modalOverlay";
  overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 999; opacity: 0; transition: opacity 0.3s ease-in-out;`;

  return { modal, overlay };
}

// Update form based on category selection
function updateFormBasedOnCategory() {
  const category = document.getElementById("fileCategory").value;
  const dynamicFields = document.getElementById("dynamicFields");

  dynamicFields.innerHTML = getDynamicFieldsForCategory(category);
}

// Get dynamic fields for selected category
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

// Close upload modal
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

// Handle file upload
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
    alert("Kérjük, válasszon ki egy fájlt a feltöltéshez!");
    return;
  }

  let formData = new FormData();
  formData.append("image", fileInput.files[0]); // 🔹 PHP "image"-et vár
  formData.append("name", fileTitle); // 🔹 PHP "name"-et vár
  formData.append("description", fileDesc);
  formData.append("price", filePrice);
  formData.append("quantity", 1); // 🔹 Ha nincs, alapértelmezett 1
  formData.append("brand_id", fileBrand); // 🔹 "brand_id" kell, nem "fileBrand"
  formData.append("condition", fileCondition);
  formData.append("size", fileSize);

  fetch("backend/ossztermekupload.php", {
      method: "POST",
      body: formData
  })
  .then(response => response.json())
  .then(data => {
      console.log("Szerver válasza:", data);
      if (data.success) {
          alert("Sikeres feltöltés!");
          closeUploadModal();
          fetchProducts();
      } else {
          alert("Hiba: " + data.message);
      }
  })
  .catch(error => {
      console.error("Hiba a feltöltés során:", error);
      alert("Hiba történt a fájl feltöltésekor.");
  });
}




document.addEventListener("DOMContentLoaded", fetchProducts);

function fetchProducts() {
  fetch("backend/ossztermeklekero.php")
    .then(response => response.json())
    .then(data => {
      console.log("Lekért adatok:", data);

      // Ellenőrizzük, hogy a data egy objektum-e és van-e benne 'products' kulcs
      if (!data || typeof data !== "object" || !Array.isArray(data.products)) {
        console.error("Hiba: A visszakapott adat nem megfelelő formátumú!", data);
        return;
      }

      var productList = document.querySelector(".product-list");
      productList.innerHTML = "";

      data.products.forEach(product => {
        var productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.dataset.productId = product.id;
        productCard.dataset.productName = product.name;
        productCard.dataset.productDescription = product.description;
        productCard.dataset.productPrice = product.price;
        productCard.dataset.productSize = product.size || "N/A";
        productCard.dataset.productCondition = product.condition || "N/A";
        productCard.dataset.productImage = product.img_url;

        productCard.innerHTML = `
          <img src="${product.img_url}" alt="${product.name}" class="product-image">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <h3>Ár: ${product.price} Ft</h3>
          <p>Méret: ${product.size || "N/A"}</p>
          <p>Állapot: ${product.condition || "N/A"}</p>
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

// Termék modal megnyitása
function openProductModal(card) {
  var existingModal = document.getElementById("productModal");
  if (existingModal) {
    existingModal.remove();
  }

  var modal = document.createElement("div");
  modal.id = "productModal";
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.width = "400px";
  modal.style.padding = "20px";
  modal.style.backgroundColor = "#fff";
  modal.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
  modal.style.zIndex = "1000";
  modal.style.borderRadius = "8px";

  modal.innerHTML = `
    <h2>${card.dataset.productName}</h2>
    <img src="${card.dataset.productImage}" alt="${card.dataset.productName}" style="width:100%; max-height:200px; object-fit:cover;">
    <p>${card.dataset.productDescription}</p>
    <h3>Ár: ${card.dataset.productPrice} Ft</h3>
    <button onclick="closeProductModal()" style="padding:8px 12px; background:red; color:white; border:none; cursor:pointer;">Bezárás</button>
  `;

  document.body.appendChild(modal);
}

// Termék modal bezárása
function closeProductModal() {
  var modal = document.getElementById("productModal");
  if (modal) {
    modal.remove();
  }
}

// Kategória megjelenítése
function toggleCategory(categoryId) {
  var category = document.getElementById(categoryId);
  
  if (category.style.display === "block") {
      category.style.display = "none";
  } else {
      category.style.display = "block";
  }
}