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
  });
  
  function displayCartItems() {
    const cartContainer = document.getElementById("cartItems");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>A kosarad üres.</p>";
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
              <input type="number" value="${cartItem.quantity}" min="1" style="width: 30px;">
              <p>${cartItem.quantity * product.price} Ft</p>
              <button onclick="removeFromCart(${product.id})">Eltávolítás</button>
            `;
  
            cartContainer.appendChild(itemDiv);
          }
        });
      })
      .catch(error => {
        console.error("Hiba a termékek betöltése közben:", error);
        cartContainer.innerHTML = "<p>Hiba történt a kosár megjelenítésekor.</p>";
      });

      function removeFromCart(productId) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart = cart.filter(item => item.productId !== productId);
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCartItems();
      }      
  }