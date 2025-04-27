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
                document.getElementById("county").value = data.county || "";

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
                    const product = item.item || {}; // Ellenőrizzük, hogy az item létezik-e
                    const productName = product.name || "Ismeretlen termék"; // Alapértelmezett név
                    const productPrice = product.price || 0; // Alapértelmezett ár
                
                    const itemRow = document.createElement("div");
                    itemRow.classList.add("item-row");
                    itemRow.innerHTML = `
                        <span>${productName}</span>
                        <span>${formatPrice(productPrice.toLocaleString("hu-HU"))} Ft</span>
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
                const totalCost = cartItems.reduce((sum, item) => {
                    const product = item.item || {}; // Ellenőrizzük, hogy az item létezik-e
                    const productPrice = product.price || 0; // Alapértelmezett ár
                    return sum + productPrice * item.quantity;
                }, 0) + shippingCost;
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

    // Az űrlap beküldésének kezelése
    const checkoutButton = document.getElementById("shippingForm");
    if (checkoutButton) {
        checkoutButton.addEventListener("submit", checkout);
    } else {
        console.error("Nem található a checkoutButton azonosítójú elem a DOM-ban.");
    }
});
function formatPrice(price) {
    // Biztosítjuk, hogy a price string típusú legyen
    const cleanPrice = String(price).replace(/\D/g, ''); // A nem szám karaktereket eltávolítjuk
    // Visszafordítjuk a számot és szóközökkel tagoljuk
    const formattedPrice = cleanPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return formattedPrice;
}

function checkout(event) {
    event.preventDefault(); // Az alapértelmezett viselkedés megakadályozása

    // Az űrlap mezőinek lekérése
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const zip = document.getElementById("zip").value.trim();
    const city = document.getElementById("city").value.trim();
    const county = document.getElementById("county").value.trim();
    const address = document.getElementById("address").value.trim();
    const shippingMethod = document.getElementById("shippingMethod").value;

    // Ellenőrzés: minden mező ki van-e töltve
    if (!name || !email || !phone || !zip || !city || !address || !shippingMethod || !county) {
        showMessage("Kérlek, töltsd ki az összes mezőt a vásárlás folytatásához!", "error");
        return;
    }

    // Az address mező szétbontása reguláris kifejezéssel
    const addressRegex = /^(.*)\s+(\S+)$/; // Az utolsó szóköz utáni rész lesz a házszám
    const match = address.match(addressRegex);
    let street = "";
    let houseNumber = "";

    if (match) {
        street = match[1].trim(); // Az utca neve
        houseNumber = match[2].trim(); // A házszám
    } else {
        showMessage("Kérlek, add meg az utcát és a házszámot helyesen (pl. 'Árpád utca 31.')!", "error");
        return;
    }

    // Adatok frissítése az adatbázisban
    const userData = {
        name,
        email,
        phone,
        zip,
        city,
        county,
        street,
        houseNumber
    };

    console.log("Küldött adatok:", userData); // Debug: Ellenőrizd a küldött adatokat

    fetch("backend/checkout_Update.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Ha az adatok sikeresen frissültek, folytatjuk a vásárlást
            finalizeCheckout();
        } else {
            showMessage("Hiba történt az adatok frissítésekor: " + data.message, "error");
        }
    })
    .catch(error => {
        console.error("Hálózati hiba:", error); // A hiba részletei a konzolban
        showMessage("Hálózati hiba történt. Kérlek, próbáld újra!", "error");
    });
}

function finalizeCheckout() {
    // Vásárlás véglegesítése
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
            document.querySelector(".checkout-wrapper").classList.add("hidden");
            document.getElementById("successMessage").classList.remove("hidden");
            document.getElementById("progress2").classList.remove("active");
            document.getElementById("progress3").classList.add("active");
            showMessage("A vásárlás sikeresen befejeződött!", "success");
        } else {
            showMessage("Hiba történt a vásárlás során: " + (result.error || "Ismeretlen hiba"), "error");
        }
    })
    .catch(error => {
        console.error("Hiba a vásárlás során:", error);
        showMessage("Hiba történt a vásárlás során. Kérlek, próbáld újra!", "error");
    });
}

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
  