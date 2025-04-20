function openNav() {
    document.getElementById("menu").style.width = "300px";
}

function closeNav() {
    document.getElementById("menu").style.width = "0";
}
function stickyNav() {
    const navbar = document.querySelector("nav");
    const headerHeight = document.querySelector(".checkout-wrapper").offsetHeight / 2;
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
    // Profiladatok betöltése
    fetch("backend/get_profile.php")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Input mezők kitöltése
                document.getElementById("name").value = `${data.firstname || ""} ${data.lastname || ""}`;
                document.getElementById("email").value = data.email || "";
                document.getElementById("phone").value = data.phone_number || "";
                document.getElementById("zip").value = data.postcode || "";
                document.getElementById("city").value = data.city || "";

                // Utca és házszám összefűzése az address mezőhöz
                const street = data.street && data.street !== "" ? data.street : "";
                const houseNumber = data.address && data.address !== "" ? data.address : "";
                document.getElementById("address").value = `${street} ${houseNumber}`.trim();
            } else {
                console.error("Hiba a profiladatok betöltésekor:", data.message);
            }
        })
        .catch(error => {
            console.error("Hálózati hiba a profiladatok betöltésekor:", error);
        });

    // Kosár tartalmának betöltése
    fetch("backend/kosarlekero.php")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const cartContainer = document.querySelector(".order-summary");
                const cartItems = data.sales;

                // Töröljük az alapértelmezett tartalmat
                cartContainer.innerHTML = "";

                // Kosár elemek hozzáadása
                cartItems.forEach(item => {
                    const itemRow = document.createElement("div");
                    itemRow.classList.add("item-row");
                    itemRow.innerHTML = `
                        <span>${item.product.name}</span>
                        <span>${formatPrice(item.product.price.toLocaleString("hu-HU"))} Ft</span>
                    `;
                    cartContainer.appendChild(itemRow);
                });

                // Szállítási költség hozzáadása (ha van)
                const shippingCost = 1000; // Példa szállítási költség
                const shippingRow = document.createElement("div");
                shippingRow.classList.add("item-row");
                shippingRow.innerHTML = `
                    <span>Szállítás</span>
                    <span>${formatPrice(shippingCost.toLocaleString("hu-HU"))} Ft</span>
                `;
                cartContainer.appendChild(shippingRow);

                // Végösszeg kiszámítása
                const totalCost = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0) + shippingCost;
                const totalRow = document.createElement("div");
                totalRow.classList.add("total");
                totalRow.innerHTML = `
                    <span>Végösszeg</span>
                    <span>${formatPrice(totalCost.toLocaleString("hu-HU"))} Ft</span>
                `;
                cartContainer.appendChild(totalRow);
            } else {
                console.error("Hiba a kosár betöltésekor:", data.error);
            }
        })
        .catch(error => {
            console.error("Hálózati hiba a kosár betöltésekor:", error);
        });
});

function formatPrice(price) {
  // Biztosítjuk, hogy a price string típusú legyen
  const cleanPrice = String(price).replace(/\D/g, '');  // A nem szám karaktereket eltávolítjuk
  // Visszafordítjuk a számot és szóközökkel tagoljuk
  const formattedPrice = cleanPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return formattedPrice;
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
            showMessage("A vásárlás sikeresen befejeződött!", 'success');
            displayCartItems(); // Frissítsük a kosár tartalmát
        } else {
            showMessage("Hiba történt a vásárlás során: " + (result.error || "Ismeretlen hiba"), 'error');
        }
    })
    .catch(error => {
        console.error("Hiba a vásárlás során:", error);
        showMessage("Hiba történt a vásárlás során.", 'error');
    });
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    displayCartItems();
  });