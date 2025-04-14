function stickyNav() {
  const navbar = document.querySelector("nav");
  const headerHeight = document.querySelector(".container").offsetHeight / 2;
  const scrollValue = window.scrollY;

  navbar.classList.toggle("header-sticky", scrollValue > headerHeight);
}
window.addEventListener("scroll", stickyNav);

function search() {
  const searchTerm = document.getElementById('search').value;
  const output = document.getElementById('output');

  const messages = {
    'apple': 'Search term matched: apple',
    'banana': 'Search term matched: banana',
  };

  output.innerHTML = messages[searchTerm] || `No matching result for the search term: ${searchTerm}`;
}

function toggleSearch() {
  const searchBtn = document.getElementById("searchBtn");
  searchBtn.style.display = searchBtn.style.display === "none" ? "block" : "none";
}

document.getElementById("searchBtn").style.display = "none";
document.getElementById("cartBtn").style.display = "none";

const cartBtn = document.getElementById("cartBtn");
cartBtn.parentElement.addEventListener("mouseenter", () => cartBtn.style.display = "block");
cartBtn.parentElement.addEventListener("mouseleave", () => cartBtn.style.display = "none");

document.addEventListener("DOMContentLoaded", () => {
  displayCartItems();
  fetchAndDisplayProducts();
});

function fetchAndDisplayProducts() {
  fetch("backend/ossztermeklekero.php")
    .then(response => response.json())
    .then(data => {
      console.log("Lekért adatok:", data);

      if (!data || typeof data !== "object" || !Array.isArray(data.products)) {
        console.error("Hiba: A visszakapott adat nem megfelelő formátumú!", data);
        return;
      }

      let productList = document.querySelector(".product-list");
      if (!productList) return;

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

      // Új adatokat küldünk a PHP-nek
      uploadProductsToArchive(data);

      document.querySelectorAll(".product-card").forEach(card => {
        card.addEventListener("click", function () {
          openProductModal(this);
        });
      });
    })
    .catch(error => console.error("Hiba a termékek lekérésekor:", error));
}

function uploadProductsToArchive(data) {
  fetch("backend/kosarhozad.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(response => response.text())
  .then(result => {
    console.log("Adatok feltöltve az archive táblába:", result);
  })
  .catch(error => {
    console.error("Hiba a termékek feltöltésekor:", error);
  });
}

function displayCartItems() {
  const cartContainer = document.getElementById("cartItems");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>A kosarad üres.</p>";
    document.getElementById("totalAmount").textContent = "0 Ft";
    return;
  }

  fetch("backend/ossztermeklekero.php")
    .then(response => response.json())
    .then(data => {
      const allProducts = data.products;
      cartContainer.innerHTML = "";

      cart.forEach(cartItem => {
        const product = allProducts.find(p => p.id == cartItem.productId);

        if (product) {
          const itemDiv = document.createElement("div");
          itemDiv.classList.add("cart-item");

          itemDiv.innerHTML = `
            <div class="itemHeader">
              <img src="${product.img_url}" alt="${product.name}" style="width: 100px; height: auto;">
              <h3>${product.name}</h3>
            </div>
            <p>${product.price} Ft</p>
            <input type="number" value="${cartItem.quantity}" style="width: 30px;" onchange="updateQuantity(${product.id}, this.value)">
            <p class="cart-total">${cartItem.quantity * product.price} Ft</p>
            <button onclick="removeFromCart(${product.id})">Eltávolítás</button>
          `;

          cartContainer.appendChild(itemDiv);
        }
      });

      updateCartTotal();
    })
    .catch(error => {
      console.error("Hiba a termékek betöltése közben:", error);
      cartContainer.innerHTML = "<p>Hiba történt a kosár megjelenítésekor.</p>";
    });
}

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.productId !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCartItems();
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