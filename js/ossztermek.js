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