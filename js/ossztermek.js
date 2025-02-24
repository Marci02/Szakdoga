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

// Keresés
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

function toggleSearch() {
  var x = document.getElementById("searchBtn");
  if (x.style.display === "none" || x.style.display === "") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

document.getElementById("searchBtn").style.display = "none";
document.getElementById("cartBtn").style.display = "none";

document.getElementById("cartBtn").parentElement.addEventListener("mouseenter", function() {
  document.getElementById("cartBtn").style.display = "block";
});

document.getElementById("cartBtn").parentElement.addEventListener("mouseleave", function() {
  document.getElementById("cartBtn").style.display = "none";
});

// Feltöltési modal
function openUploadModal() {
  var modal = document.createElement("div");
modal.id = "uploadModal";
modal.style.position = "fixed";
modal.style.top = "50%";
modal.style.left = "50%";
modal.style.transform = "translate(-50%, -50%)";
modal.style.width = "400px";  // Növelt szélesség
modal.style.padding = "30px";  // Növelt padding
modal.style.backgroundColor = "#fff";
modal.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.1)";
modal.style.borderRadius = "15px";
modal.style.zIndex = "1000";
modal.style.textAlign = "center";  // Középre igazított szöveg

var modalContent = document.createElement("div");
modalContent.innerHTML = `
  <h2 style="font-size: 1.8em; font-weight: bold; color: #222; margin-bottom: 20px;">Termék feltöltése</h2>
  
  <!-- Input mezők és textarea -->
  <input type="text" id="fileTitle" placeholder="Termék címe" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">
  
  <input type="file" id="fileInput" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">
  
  <textarea id="fileDesc" rows="5" style="width: 100%; resize:none; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;" placeholder="Leírás"></textarea>
  
  <input type="number" id="filePrice" placeholder="Ár (Ft)" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">
  
  <input type="number" id="fileQuantity" placeholder="Darabszám" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">
  
  <input type="text" id="fileCategory" placeholder="Kategória" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">
  
  <input type="text" id="fileBrand" placeholder="Márka" style="width: 100%; padding: 10px; margin-bottom: 25px; border-radius: 8px; border: 2px solid #ddd; background-color: #f9f9f9; font-size: 1em;">
  
  <!-- Gombok -->
  <button onclick="uploadFile()" style="background-color: #22222a; color: white; padding: 12px 20px; border-radius: 8px; border: none; font-size: 16px; width: 48%; cursor: pointer; transition: background-color 0.3s ease;">
    Feltöltés
  </button>
  
  <button onclick="closeUploadModal()" style="background-color: #ecf0f1; color: #333; padding: 12px 20px; border-radius: 8px; border: 1px solid #ddd; font-size: 16px; width: 48%; cursor: pointer; transition: background-color 0.3s ease;">
    Mégse
  </button>
`;

modal.appendChild(modalContent);
document.body.appendChild(modal);
}

function closeUploadModal() {
  var modal = document.getElementById("uploadModal");
  if (modal) {
    document.body.removeChild(modal);
  }
}

function uploadFile() {
  var fileTitle = document.getElementById("fileTitle").value;
  var fileDesc = document.getElementById("fileDesc").value;
  var filePrice = document.getElementById("filePrice").value;
  var fileQuantity = document.getElementById("fileQuantity").value;
  var fileCategory = document.getElementById("fileCategory").value;
  var fileBrand = document.getElementById("fileBrand").value;
  var fileInput = document.getElementById("fileInput").files[0];

  if (fileTitle && fileDesc && filePrice && fileQuantity && fileCategory && fileBrand && fileInput) {
    var formData = new FormData();
    formData.append("fileTitle", fileTitle);
    formData.append("fileDesc", fileDesc);
    formData.append("filePrice", filePrice);
    formData.append("fileQuantity", fileQuantity);
    formData.append("fileCategory", fileCategory);
    formData.append("fileBrand", fileBrand);
    formData.append("fileInput", fileInput);

    fetch("backend/ossztermekupload.php", {
      method: "POST",
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      alert(data.message);
      closeUploadModal();
      fetchProducts();
    })
    .catch(error => console.error("Error:", error));
  } else {
    alert("Minden mezőt ki kell tölteni!");
  }
}

// Termékek lekérése és megjelenítése
function fetchProducts() {
  fetch("backend/ossztermeklekero.php")
    .then(response => response.json())
    .then(data => {
      var productList = document.querySelector(".product-list");
      productList.innerHTML = "";

      data.forEach(product => {
        var productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.dataset.productId = product.id;
        productCard.dataset.productName = product.name;
        productCard.dataset.productDescription = product.description;
        productCard.dataset.productPrice = product.price;
        productCard.dataset.productImage = product.img_url;

        productCard.innerHTML = `
          <img src="${product.img_url}" alt="${product.name}" class="product-image">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <h3>Ár: ${product.price} Ft</h3>
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

// Termék popup megnyitása
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

// Termék popup bezárása
function closeProductModal() {
  var modal = document.getElementById("productModal");
  if (modal) {
    modal.remove();
  }
}

// Oldal betöltésekor termékek betöltése
document.addEventListener("DOMContentLoaded", fetchProducts);
