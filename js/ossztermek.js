// Duplikált függvény eltávolítva: uploadFile


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
  var modal = document.createElement("div");
  modal.id = "uploadModal";
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.height = "auto";
  modal.style.lineHeight = "2";
  modal.style.width = "400px";
  modal.style.padding = "40px";
  modal.style.backgroundColor = "#fff";
  modal.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
  modal.style.zIndex = "1000";
  modal.style.borderRadius = "5px";

  var modalContent = document.createElement("div");
  modalContent.innerHTML = `
    <h2 style="margin-bottom: 20px;">Termék feltöltése</h2>
    <input type="text" id="fileTitle" placeholder="Termék címének megadása" style="width: 300px; padding: 5px;">
    <input type="file" id="fileInput" style="cursor: pointer;">
    <h4>Leírás:</h4>
    <textarea id="fileDesc" rows="5" cols="50" style="padding:5px; resize: none; width: 300px;" placeholder="Termék rövid leírása"></textarea>
    <h4>Ár:</h4>
    <input type="number" id="filePrice" placeholder="Termék ára" style="width: 300px; padding: 5px; margin-bottom: 15px;" min="0">
    <button onclick="uploadFile()" style="cursor: pointer; padding:6px; color: white; background-color: black; border-radius: 5px; border: none;">Feltöltés</button>
    <button onclick="closeUploadModal()" style="cursor: pointer; padding:5px; background-color: white; border-radius: 5px;">Mégse</button>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Ellenőrizve, hogy létezik-e már az overlay
  if (!document.getElementById("modalOverlay")) {
    var overlay = document.createElement("div");
    overlay.id = "modalOverlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
    overlay.style.zIndex = "999";
    document.body.appendChild(overlay);
  }
}

function closeUploadModal() {
  var modal = document.getElementById("uploadModal");
  var overlay = document.getElementById("modalOverlay");
  if (modal) {
    document.body.removeChild(modal);
  }
  if (overlay) {
    document.body.removeChild(overlay);
  }
}

function openProductModal(title, desc, price, imgSrc) {
  var modal = document.createElement("div");
  modal.id = "productModal";
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.height = "auto";
  modal.style.width = "500px"; // Növelt szélesség
  modal.style.padding = "30px";
  modal.style.backgroundColor = "#fff";
  modal.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
  modal.style.zIndex = "1000";
  modal.style.borderRadius = "10px";

  var modalContent = `
    <h2>${title}</h2>
    <img src="${imgSrc}" alt="${title}" style="width: 100%; height: auto; border-radius: 5px;">
    <p style="margin-top: 15px;">${desc}</p>
    <h3>Ár: ${price} Ft</h3>
    <button onclick="closeProductModal()" style="cursor: pointer; padding:10px; color: white; background-color: black; border-radius: 5px; border: none;">Bezárás</button>
  `;

  modal.innerHTML = modalContent;
  document.body.appendChild(modal);

  // Ellenőrizve, hogy létezik-e már az overlay
  if (!document.getElementById("modalOverlay")) {
    var overlay = document.createElement("div");
    overlay.id = "modalOverlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
    overlay.style.zIndex = "999";
    document.body.appendChild(overlay);
  }

  document.body.style.overflow = "hidden";
}

function closeProductModal() {
  var modal = document.getElementById("productModal");
  var overlay = document.getElementById("modalOverlay");
  if (modal) document.body.removeChild(modal);
  if (overlay) document.body.removeChild(overlay);
  document.body.style.overflow = "auto";
}

function uploadFile() {
  var fileTitle = document.getElementById("fileTitle").value;
  var fileDesc = document.getElementById("fileDesc").value;
  var fileInput = document.getElementById("fileInput").files[0];
  var filePrice = document.getElementById("filePrice").value;

  if (fileTitle && fileDesc && fileInput && filePrice) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var productList = document.querySelector(".product-list");

      // Ellenőrizzük, hogy létezik a product-list
      if (productList) {
        var productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.innerHTML = `
          <img src="${e.target.result}" alt="${fileTitle}" style="width: 100%; height: auto; border-radius: 5px;">
          <h3>${fileTitle}</h3>
          <p>${fileDesc}</p>
          <h3>Ár: ${filePrice} Ft</h3>
        `;

        productCard.addEventListener("click", function() {
          openProductModal(fileTitle, fileDesc, filePrice, e.target.result);
        });

        productList.appendChild(productCard);
        closeUploadModal();
      } else {
        console.log("A product-list nem található.");
      }
    };
    reader.readAsDataURL(fileInput);
  } else {
    alert("Minden mezőt ki kell tölteni!");
  }
}