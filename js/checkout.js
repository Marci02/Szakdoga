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

/*function checkout() {
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
  });*/