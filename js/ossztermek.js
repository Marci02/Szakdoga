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

function openUploadModal() {
  console.log("Popup megnyitása");

  var modal = document.createElement("div");
  modal.id = "uploadModal";
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.width = "400px";
  modal.style.padding = "30px";
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

function updateFormBasedOnCategory() {
  var category = document.getElementById("fileCategory").value;
  var dynamicFields = document.getElementById("dynamicFields");

  dynamicFields.innerHTML = '';

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
    dynamicFields.innerHTML = '';
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

function closeUploadModal() {
  var modal = document.getElementById("uploadModal");
  var overlay = document.getElementById("modalOverlay");

  if (modal) {
    modal.style.opacity = "0";
  }
  if (overlay) {
    overlay.style.opacity = "0";
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
  var filePrice = document.getElementById("filePrice").value;
  var fileCategory = document.getElementById("fileCategory").value;
  var fileBrand = document.getElementById("fileBrand").value;
  var fileInput = document.getElementById("fileInput").files[0];
  var fileSize = document.getElementById("fileSize") ? document.getElementById("fileSize").value : "";
  var fileCondition = document.getElementById("fileCondition") ? document.getElementById("fileCondition").value : "";

  if (fileTitle && fileDesc && filePrice && fileCategory && fileBrand && fileInput && fileCondition) {
    var formData = new FormData();
    formData.append("fileTitle", fileTitle);
    formData.append("fileDesc", fileDesc);
    formData.append("filePrice", filePrice);
    formData.append("fileCategory", fileCategory);
    formData.append("fileBrand", fileBrand);
    formData.append("fileInput", fileInput);
    formData.append("fileSize", fileSize);
    formData.append("fileCondition", fileCondition);

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
        productCard.dataset.productSize = product.size;  // Új adat: méret
        productCard.dataset.productCondition = product.condition; // Új adat: állapot
        productCard.dataset.productImage = product.img_url;

        productCard.innerHTML = `
          <img src="${product.img_url}" alt="${product.name}" class="product-image">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <h3>Ár: ${product.price} Ft</h3>
          ${product.size ? `<p>Méret: ${product.size}</p>` : ""}
          ${product.condition ? `<p>Állapot: ${product.condition}</p>` : ""}
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

function closeProductModal() {
  var modal = document.getElementById("productModal");
  if (modal) {
    modal.remove();
  }
}

function toggleCategory(categoryId) {
  var category = document.getElementById(categoryId);
  
  if (category.style.display === "block") {
      category.style.display = "none";
  } else {
      category.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", fetchProducts);
