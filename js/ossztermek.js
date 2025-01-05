function openNav() {
    document.getElementById("menu").style.width = "300px";
  }
  
  function closeNav() {
    document.getElementById("menu").style.width = "0";
  }
  
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
  
  // Search gomb megjelenítése/elrejtése
  function toggleSearch() {
    var x = document.getElementById("searchBtn");
    if (x.style.display === "none" || x.style.display === "") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  } 
  
  // Alapvetően a kosár és a kereső gomb elrejtése
  document.getElementById("searchBtn").style.display = "none";
  document.getElementById("cartBtn").style.display = "none";
  
  document.getElementById("cartBtn").parentElement.addEventListener("mouseenter", function() {
    document.getElementById("cartBtn").style.display = "block";
  });
  
  document.getElementById("cartBtn").parentElement.addEventListener("mouseleave", function() {
    document.getElementById("cartBtn").style.display = "none";
  });

  function openUploadModal() {
    // Create modal elements
    var modal = document.createElement("div");
    modal.id = "uploadModal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.height = "auto";
    modal.style.lineHeight = "2";
    modal.style.width = "400px";
    modal.style.padding = "20px";
    modal.style.backgroundColor = "#fff";
    modal.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
    modal.style.zIndex = "1000";
    modal.style.borderRadius = "5px";

    var modalContent = document.createElement("div");
    modalContent.innerHTML = `
      <h2>Termék feltöltése</h2>
      <input type="text" id="fileTitle" placeholder = "Termék címének megadása" style="width: 300px; padding: 5px;">
      <input type="file" id="fileInput" style="cursor: pointer;">
      <h4>Leírás:</h4>
      <textarea id="fileDesc" rows="5" cols="50" style="padding:5px;"></textarea>
      <button onclick="uploadFile()" style="cursor: pointer; padding:6px; color: white; background-color: black; border-radius: 5px; border: none;">Feltöltés</button>
      <button onclick="closeUploadModal()" style="cursor: pointer; padding:5px; background-color: white; border-radius: 5px;">Mégse</button>
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
    overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
    overlay.style.zIndex = "999";

    document.body.appendChild(overlay);
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


function uploadFile() {
  var fileTitle = document.getElementById("fileTitle").value;
  var fileDesc = document.getElementById("fileDesc").value;
  var fileInput = document.getElementById("fileInput").files[0];

  if (fileTitle && fileDesc && fileInput) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var card = document.createElement("div");
      card.className = "product-card";

      var cardTitle = document.createElement("h3");
      cardTitle.innerText = fileTitle;
      card.appendChild(cardTitle);

      var cardImage = document.createElement("img");
      cardImage.src = e.target.result;
      
      cardImage.style.borderRadius = "5px";
      card.appendChild(cardImage);

      var cardDesc = document.createElement("p");
      cardDesc.innerText = fileDesc;
      card.appendChild(cardDesc);

      document.getElementsByClassName("product-list").innerHTML += card;
      closeUploadModal();
    };
    reader.readAsDataURL(fileInput);
  } else {
    alert("Kérjük, töltse ki az összes mezőt és válasszon egy fájlt.");
  }
}