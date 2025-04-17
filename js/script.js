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

// Search gomb
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