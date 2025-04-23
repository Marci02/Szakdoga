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
  
  function search() {

    var searchTerm = document.getElementById('search').value;
  
    if (searchTerm === 'apple') {
      document.getElementById('output').innerHTML = 'Search term matched: apple';
    } else if (searchTerm === 'banana') {
      document.getElementById('output').innerHTML = 'Search term matched: banana';
    } else {
      document.getElementById('output').innerHTML = 'No matching result for the search term: ' + searchTerm;
    }
  }
  
  // Search gomb megjelenítése/elrejtése
  function toggleSearch() {
    var x = document.getElementById("searchBtn");
    if (x.style.display === "none" || x.style.display === "") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  } 
  
  // Alapvetően a kosár és a kereső gomb elrejtése
  document.getElementById("searchBtn").style.display = "none";
  document.getElementById("cartBtn").style.display = "none";
  
  document.getElementById("cartBtn").parentElement.addEventListener("mouseenter", function() {
    document.getElementById("cartBtn").style.display = "block";
  });
  
  document.getElementById("cartBtn").parentElement.addEventListener("mouseleave", function() {
    document.getElementById("cartBtn").style.display = "none";
  });

  function formatPrice(price) {
    // Biztosítjuk, hogy a price string típusú legyen
    const cleanPrice = String(price).replace(/\D/g, '');  // A nem szám karaktereket eltávolítjuk
    // Visszafordítjuk a számot és szóközökkel tagoljuk
    const formattedPrice = cleanPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return formattedPrice;
  }