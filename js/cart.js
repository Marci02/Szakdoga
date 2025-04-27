function stickyNav() {
  const navbar = document.querySelector("nav");
  const headerHeight = document.querySelector(".container").offsetHeight / 2;
  const scrollValue = window.scrollY;

  navbar.classList.toggle("header-sticky", scrollValue > headerHeight);
}
window.addEventListener("scroll", stickyNav);

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

function toggleSearch() {
  var x = document.getElementById("searchBtn");
  if (x.style.display === "none" || x.style.display === "") {
      x.style.display = "block";
  } else {
      x.style.display = "none";
  }
}

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

document.getElementById("searchbuttonToSearchBar").addEventListener("click", search);

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

function displayCartItems() {
  const cartContainer = document.getElementById("cartItems");

  // Clear the cart container before fetching data
  cartContainer.innerHTML = "<p>Betöltés...</p>";

  // Fetch sales data from the backend
  fetch("backend/kosarlekero.php")
    .then(response => {
      if (!response.ok) {
        throw new Error("Hiba a válaszban");
      }
      return response.json();
    })
    .then(data => {
      console.log("API válasz:", data); // Debugging API response

      // Validate the 'sales' key in the API response
      if (!data.success || !data.sales || !Array.isArray(data.sales)) {
        console.error("A 'sales' kulcs nem található vagy nem megfelelő az API válaszban:", data);
        cartContainer.innerHTML = "<p>Hiba történt a termékek betöltésekor.</p>";
        return;
      }

      const sales = data.sales;

      // Handle empty sales
      if (sales.length === 0) {
        cartContainer.innerHTML = "<p style='text-align: center;'>A kosarad üres.</p>";
        document.getElementById("totalAmount").textContent = "0 Ft";
        return;
      }

      // Clear the cart container
      cartContainer.innerHTML = "";

      // Iterate through sales items
      sales.forEach(sale => {
    console.log("Eladás elem:", sale); // Debugging sale item

    // Ellenőrizzük, hogy az item és az image_url létezik-e
    const product = sale.item || {};
    const imageUrl = product.image_url || "default.jpg"; // Alapértelmezett kép, ha nincs megadva
    const productName = product.name || "Ismeretlen termék";
    const productPrice = product.price || 0;

    // Create cart item element
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");

    itemDiv.innerHTML = `
        <div class="itemHeader">
          <img src="uploads/${imageUrl}" alt="${productName}" style="width: 100px; height: auto;">
          <h3>${productName}</h3>
        </div>
        <p>${parseInt(productPrice).toLocaleString("hu-HU")} Ft</p>
        <input type="number" value="${sale.quantity}" style="width: 30px;" max="${product.quantity || 1}" onchange="updateQuantity(${product.id}, this.value)">
        <p class="cart-total">${(sale.quantity * productPrice).toLocaleString("hu-HU")} Ft</p>
        <button class="cart-button" onclick="removeFromCart(${product.id})">Eltávolítás</button>
    `;

    cartContainer.appendChild(itemDiv);
});
      // Update the total amount
      updateCartTotal(sales);
    })
    .catch(error => {
      console.error("Hiba a termékek betöltése közben:", error);
      cartContainer.innerHTML = "<p>Hiba történt a kosár megjelenítésekor.</p>";
    });
}

function removeFromCart(productId) {
  // Küldjünk törlési kérést a backendnek
  fetch("backend/kosarboltorol.php", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({ product_id: productId })
  })
  .then(response => response.json())
  .then(result => {
      if (result.success) {
          showMessage("A termék sikeresen törölve a kosárból.", 'success');
          displayCartItems(); // Frissítsük a kosár tartalmát
      } else {
          showMessage("Hiba történt a törlés során: " + (result.error || "Ismeretlen hiba"), 'error');
      }
  })
  .catch(error => {
      console.error("Hiba a törlés során:", error);
      showMessage("Hiba történt a törlés során.", 'error');
  });
}

function updateQuantity(productId, newQuantity) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.map(item => {
    if (item.productId === productId) {
      return { ...item, quantity: parseInt(newQuantity) };
    }
    return item;
  });
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCartItems();
}

function updateCartTotal() {
  const totalAmountElement = document.getElementById("totalAmount");
  let total = 0;

  const totalElements = document.querySelectorAll(".cart-total");
  totalElements.forEach(el => {
    const text = el.textContent.replace(/[^\d]/g, "");
    if (!isNaN(parseInt(text))) {
      total += parseInt(text);
    }
  });

  totalAmountElement.textContent = total.toLocaleString("hu-HU") + " Ft";

  
}

function toCheckout() {
  const cartItems = document.querySelectorAll(".cart-item"); // Ellenőrizzük a kosár elemeit

  if (cartItems.length === 0) {
      // Ha a kosár üres, megjelenítjük az üzenetet
      showMessage("Üres kosárral nem lehet továbbmenni!", 'error');
      return; // Megszakítjuk a függvény futását
  }

  // Ha van termék a kosárban, átirányítjuk a checkout oldalra
  window.location.href = "checkout.html";
}

document.addEventListener("DOMContentLoaded", () => {
  displayCartItems();
});

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
