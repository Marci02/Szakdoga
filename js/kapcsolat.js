function openNav() {
  document.getElementById("menu").style.width = "300px";
}

function closeNav() {
  document.getElementById("menu").style.width = "0";
}

function stickyNav() {
  const aboutSection = document.querySelector("#about");
  if (!aboutSection) return; // Exit if the #about section does not exist

  var headerHeight = aboutSection.offsetHeight / 2;
  var navbar = document.querySelector("nav");
  var scrollValue = window.scrollY;

  if (scrollValue > headerHeight) {
      navbar.classList.add("header-sticky");
  } else {
      navbar.classList.remove("header-sticky");
  }
}

window.addEventListener("scroll", stickyNav);

let allProducts = []; // Global array to store all products

function fetchProducts() {
  fetch("backend/ossztermeklekero.php")
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          if (data.success && Array.isArray(data.products)) {
              allProducts = data.products; // Store all products
              console.log("All products:", allProducts); // Log the products array
          } else {
              console.error("Hiba: Nem sikerült lekérni a termékeket.");
          }
      })
      .catch(error => console.error("Hiba a termékek lekérésekor:", error));
}

document.addEventListener("DOMContentLoaded", fetchProducts);

function search() {
  const searchTerm = document.getElementById("search").value.toLowerCase();

  // Filter products based on the search term
  const filteredProducts = allProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm)
  );

  // Display the search results in a popup
  showSearchResultsPopup(filteredProducts);

  // Display a message if no products match the search term
  if (filteredProducts.length === 0) {
      showMessage(`Nincs találat a(z) "${searchTerm}" keresésre.`, 'error');
  }
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
  popup.style.width = "auto"; // Match the search bar's width
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
          productCard.style.color = "#bdbdd5";

          productCard.style.border = "1px solid #ddd";
          productCard.style.borderRadius = "5px";
          productCard.style.marginBottom = "10px";
          productCard.style.padding = "10px";
          productCard.style.display = "flex";
          productCard.style.alignItems = "center";

          productCard.innerHTML = `
              <img src="${product.img_url}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 10px;">
              <div>
                  <h4 style="margin: 0; font-size: 16px;">${product.name}</h4>
                  <p style="margin: 0; font-size: 14px; color: #555;">${formatPrice(product.price)} Ft</p>
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

function toggleSearch() {
  var x = document.getElementById("searchBtn");
  if (x.style.display === "none" || x.style.display === "") {
      x.style.display = "block";
  } else {
      x.style.display = "none";
  }
}

document.getElementById("searchbuttonToSearchBar").addEventListener("click", search);

document.getElementById("search").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
      search();
  }
});

function formatPrice(price) {
  // Ensure the price is a string
  const cleanPrice = String(price).replace(/\D/g, ''); // Remove non-numeric characters
  // Format the number with spaces as thousand separators
  const formattedPrice = cleanPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return formattedPrice;
}

document.getElementById("searchBtn").style.display = "none";
  document.getElementById("cartBtn").style.display = "none";
  
  document.getElementById("cartBtn").parentElement.addEventListener("mouseenter", function() {
    document.getElementById("cartBtn").style.display = "block";
  });
  
  document.getElementById("cartBtn").parentElement.addEventListener("mouseleave", function() {
    document.getElementById("cartBtn").style.display = "none";
  });