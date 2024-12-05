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


document.getElementById('uploadBtn').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'block';
  });

  document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const image = document.getElementById('imageUpload').files[0];
    const name = document.getElementById('cardName').value;
    const description = document.getElementById('cardDescription').value;

    if (image && name && description) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const card = document.createElement('div');
        card.innerHTML = `
          <img src="${e.target.result}" alt="${name}" style="width:100px;height:100px;"><br>
          <strong>${name}</strong><br>
          <p>${description}</p>
        `;
        document.body.appendChild(card);
        document.getElementById('popup').style.display = 'none';
        document.getElementById('uploadForm').reset();
      };
      reader.readAsDataURL(image);
    } else {
      alert('Please fill out all fields and upload an image.');
    }
  });