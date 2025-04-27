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



const items = document.querySelectorAll(".item"),
  controls = document.querySelectorAll(".control"),
  headerItems = document.querySelectorAll(".item-header"),
  descriptionItems = document.querySelectorAll(".item-description"),
  activeDelay = 0.76,
  interval = 5000;

let current = 0;

const slider = {
  init: () => {
    controls.forEach((control) =>
      control.addEventListener("click", (e) => {
        slider.clickedControl(e);
      })
    );
    controls[current].classList.add("active");
    items[current].classList.add("active");
  },
  nextSlide: () => {
    
    slider.reset();
    if (current === items.length - 1) current = -1; 
    current++;
    controls[current].classList.add("active");
    items[current].classList.add("active");
    slider.transitionDelay(headerItems);
    slider.transitionDelay(descriptionItems);
  },
  clickedControl: (e) => {
    
    slider.reset();
    clearInterval(intervalF);

    const control = e.target,
      dataIndex = Number(control.dataset.index);

    control.classList.add("active");
    items.forEach((item, index) => {
      if (index === dataIndex) {
        
        item.classList.add("active");
      }
    });
    current = dataIndex; // Update current slide
    slider.transitionDelay(headerItems);
    slider.transitionDelay(descriptionItems);
    intervalF = setInterval(slider.nextSlide, interval);
  },
  reset: () => {
    
    items.forEach((item) => item.classList.remove("active"));
    controls.forEach((control) => control.classList.remove("active"));
  },
  transitionDelay: (items) => {
    
    let seconds;

    items.forEach((item) => {
      const children = item.childNodes;
      let count = 1,
        delay;

      item.classList.value === "item-header"
        ? (seconds = 0.015)
        : (seconds = 0.007);

      children.forEach((child) => {

        if (child.classList) {
          item.parentNode.classList.contains("active")
            ? (delay = count * seconds + activeDelay)
            : (delay = count * seconds);
          child.firstElementChild.style.transitionDelay = `${delay}s`; // b element
          count++;
        }
      });
    });
  },
};

let intervalF = setInterval(slider.nextSlide, interval);
slider.init();

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

// Search gomb megjelenítése/elrejtése
function toggleSearch() {
  const searchBtn = document.getElementById("searchBtn");
  const searchPopup = document.getElementById("searchResultsPopup");

  if (searchBtn.style.display === "none" || searchBtn.style.display === "") {
      searchBtn.style.display = "block";
  } else {
      searchBtn.style.display = "none";

      // Remove the search results popup if it exists
      if (searchPopup) {
          searchPopup.remove();
      }
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
  popup.style.width = "auto";
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
      console.log("Response data:", data); // Log the response data
      if (data.success && Array.isArray(data.products)) {
        allProducts = data.products; // Store all products
        console.log("All products:", allProducts); // Log the products array
      } else {
        console.error("Hiba: Nem sikerült lekérni a termékeket.");
      }
    })
    .catch(error => console.error("Hiba a termékek lekérésekor:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Fetching products...");
  fetchProducts();

  updateCart(); 
});

console.log("All products after fetch:", allProducts);

document.addEventListener("DOMContentLoaded", fetchProducts);

document.getElementById("searchbuttonToSearchBar").addEventListener("click", search);

document.getElementById("search").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    search();
  }
});

// Alapvetően a kosár és a kereső gomb elrejtése
document.getElementById("searchBtn").style.display = "none";
document.getElementById("cartBtn").style.display = "none";

document.getElementById("cartBtn").parentElement.addEventListener("mouseenter", function() {
  document.getElementById("cartBtn").style.display = "block";
});

document.getElementById("cartBtn").parentElement.addEventListener("mouseleave", function() {
  document.getElementById("cartBtn").style.display = "none";
});


document.addEventListener("DOMContentLoaded", () => {
  // Ellenőrizzük, hogy van-e tárolt üzenet a localStorage-ban
  const logoutMessage = localStorage.getItem("logoutMessage");

  if (logoutMessage) {
      // Üzenet megjelenítése
      showMessage(logoutMessage, 'success');

      // Üzenet eltávolítása a localStorage-ból
      localStorage.removeItem("logoutMessage");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Ellenőrizzük, hogy van-e tárolt üzenet a localStorage-ban
  const deleteMessage = localStorage.getItem("deleteMessage");

  if (deleteMessage) {
      // Üzenet megjelenítése
      const messageBox = document.getElementById("message-box");
      if (messageBox) {
          messageBox.textContent = deleteMessage;
          messageBox.classList.add("success"); // Stílus hozzáadása
          messageBox.style.display = "block";

          // Az üzenet eltüntetése néhány másodperc után
          setTimeout(() => {
              messageBox.style.display = "none";
              localStorage.removeItem("deleteMessage"); // Üzenet törlése a localStorage-ból
          }, 5000);
      }
  }
});

function formatPrice(price) {
  // Biztosítjuk, hogy a price string típusú legyen
  const cleanPrice = String(price).replace(/\D/g, '');  // A nem szám karaktereket eltávolítjuk
  // Visszafordítjuk a számot és szóközökkel tagoljuk
  const formattedPrice = cleanPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return formattedPrice;
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