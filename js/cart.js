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

        // Create cart item element
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");
        

        itemDiv.innerHTML = `
        <div class="itemHeader">
          <img src="uploads/${sale.product.image_url}" alt="${sale.product.name}" style="width: 100px; height: auto;">
          <h3>${sale.product.name}</h3>
        </div>
        <p>${parseInt(sale.product.price).toLocaleString("hu-HU")} Ft</p>
        <input type="number" value="${sale.quantity}" style="width: 30px;" onchange="updateQuantity(${sale.product.id}, this.value)">
        <p class="cart-total">${(sale.quantity * sale.product.price).toLocaleString("hu-HU")} Ft</p>
        <button class="cart-button" onclick="removeFromCart(${sale.product.id})">Eltávolítás</button>
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
        alert("A termék sikeresen törölve a kosárból.");
        displayCartItems(); // Frissítsük a kosár tartalmát
      } else {
        alert("Hiba történt a törlés során: " + (result.error || "Ismeretlen hiba"));
      }
    })
    .catch(error => {
      console.error("Hiba a törlés során:", error);
      alert("Hiba történt a törlés során.");
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

function checkout() {
  fetch("backend/checkout.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({}) // Ha szükséges, itt küldhetsz adatokat
  })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        alert("A vásárlás sikeresen befejeződött!");
        displayCartItems(); // Frissítsük a kosár tartalmát
      } else {
        alert("Hiba történt a vásárlás során: " + (result.error || "Ismeretlen hiba"));
      }
    })
    .catch(error => {
      console.error("Hiba a vásárlás során:", error);
      alert("Hiba történt a vásárlás során.");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  displayCartItems();
});
