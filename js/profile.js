document.addEventListener("DOMContentLoaded", () => {
    const profileButton = document.getElementById("profileButton");

    updateCart();

    // Ha van profileButton (például navbarban), akkor ellenőrizzük a bejelentkezést
    if (profileButton) {
        fetch("backend/check_session.php")
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    console.log("Bejelentkezett felhasználó, átirányítás a profil oldalra.");
                    profileButton.setAttribute("href", "profile.html");
                } else {
                    console.log("Nincs bejelentkezve, átirányítás a login oldalra.");
                    profileButton.setAttribute("href", "login1.html");
                }
            })
            .catch(error => console.error("Hiba a session ellenőrzésnél:", error));
    }

    // Ha a felhasználó a profile.html oldalon van, töltsük be az adatokat
    if (window.location.pathname.includes("profile.html")) {
        fetch("backend/get_profile.php")
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                window.location.href = "login1.html"; // Ha nincs bejelentkezve, irány a login
            } else {
                console.log("Profil adatok:", data); // 🔍 Debug konzol kiírás
    
                const usernameEl = document.getElementById("username");
                const emailEl = document.getElementById("email");
                const phoneEl = document.getElementById("phone");
                const profileImageUrlEl = document.getElementById("profile-image-input");
                const profileImageEl = document.getElementById("profile-image-preview");
                const postcodeEl = document.getElementById("postcode");
                const cityEl = document.getElementById("city");
                const countyEl = document.getElementById("county");
                const streetEl = document.getElementById("street_address");
                const addressEl = document.getElementById("house_number");
    
                if (usernameEl) usernameEl.value = data.firstname + " " + data.lastname;
                if (emailEl) emailEl.value = data.email;
                if (phoneEl) phoneEl.value = data.phone_number;
                if (postcodeEl) postcodeEl.value = data.postcode;
                if (cityEl) cityEl.value = data.city;
                if (countyEl) countyEl.value = data.county;
                if (streetEl) streetEl.value = data.street || ""; 
                if (addressEl) addressEl.value = data.address || "";

                if (profileImageEl && data.image) {
                    profileImageEl.src = data.image;
                }
            }
        })
        .catch(error => console.error("Hiba a profil betöltésekor:", error));
    }
});

function search() {
    if (!productsFetched) {
        console.error("Products have not been fetched yet. Please wait.");
        return;
    }

    const searchTerm = document.getElementById("search").value.toLowerCase();
    console.log("Search term:", searchTerm); // Debugging log
    console.log("All products at search time:", allProducts); // Debugging log

    // Filter products based on the search term
    const filteredProducts = searchTerm
        ? allProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm)
        )
        : allProducts;

    console.log("Filtered products:", filteredProducts); // Debugging log

    // Display the search results in a popup
    showSearchResultsPopup(filteredProducts);

    // Display a message if no products match the search term
    if (filteredProducts.length === 0) {
        showMessage(`Nincs találat a(z) "${searchTerm}" keresésre.`, 'error');
    }
}

let allProducts = []; // Global array to store all products

let productsFetched = false;

function fetchProducts() {
    return fetch("backend/ossztermeklekero.php")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success && Array.isArray(data.products)) {
                allProducts = data.products; // Store all products
                productsFetched = true; // Set the flag to true
                console.log("All products fetched:", allProducts); // Debugging log
            } else {
                console.error("Hiba: Nem sikerült lekérni a termékeket.");
            }
        })
        .catch(error => console.error("Hiba a termékek lekérésekor:", error));
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Fetching products...");
    fetchProducts().then(() => {
        console.log("Products fetched, search is now ready.");
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");
    if (searchInput) {
        searchInput.addEventListener("keypress", function (e) {
            console.log("Key pressed:", e.key); // Debugging log
            if (e.key === "Enter") {
                e.preventDefault(); // Prevent default behavior
                console.log("Enter key detected, triggering search..."); // Debugging log
                search(); // Trigger the search function
            }
        });
    } else {
        console.error("Search input field not found in the DOM.");
    }
});

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
    popup.style.width = `${searchBar.offsetWidth}px`; // Match the search bar's width
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
            productCard.style.color = "inherit";

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
    console.log("Key pressed:", e.key); // Debugging log
    if (e.key === "Enter") {
        e.preventDefault(); // Prevent default behavior
        console.log("Enter key detected, triggering search..."); // Debugging log
        search(); // Trigger the search function
    }
});

function formatPrice(price) {
    // Biztosítjuk, hogy a price string típusú legyen
    const cleanPrice = String(price).replace(/\D/g, '');  // A nem szám karaktereket eltávolítjuk
    // Visszafordítjuk a számot és szóközökkel tagoljuk
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