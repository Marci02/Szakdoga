document.addEventListener("DOMContentLoaded", () => {
    loadUserProducts();
});

function loadUserProducts() {
    fetch("backend/get_Products.php")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const productList = document.getElementById("product-list");
                productList.innerHTML = "";

                data.products.forEach(product => {
                    const productItem = document.createElement("div");
                    productItem.classList.add("product-item");
                    productItem.innerHTML = `
                        <img src="uploads/${product.img_url}" alt="${product.name}" class="product-image">
                        <h3>${product.name}</h3>
                        <button class="editButton" onclick="openEditModal(${product.id}, '${product.name}', '${product.img_url}', ${product.price}, '${product.description}', ${product.quantity}, '${product.size}', '${product.condition}')">Szerkesztés</button>
                        <button class="deleteButton" onclick="deleteProduct(${product.id})">Törlés</button>
                    `;
                    productList.appendChild(productItem);
                });
            } else {
                console.error("Hiba a termékek lekérésekor:", data.message);
            }
        })
        .catch(error => console.error("Hálózati hiba:", error));
}

function openEditModal(id, name, img, price, description, quantity, size, condition) {
    document.getElementById("edit-product-id").value = id;
    document.getElementById("edit-product-name").value = name;
    document.getElementById("edit-product-price").value = price;
    document.getElementById("edit-product-description").value = description;
    document.getElementById("edit-product-quantity").value = quantity;
    document.getElementById("edit-product-size").value = size;
    document.getElementById("edit-product-condition").value = condition;

    const imgInput = "uploads/" + img;

    document.getElementById("edit-product-image-preview").src = imgInput;

    document.getElementById("edit-product-modal").style.display = "block";
}

function closeEditModal() {
    document.getElementById("edit-product-modal").style.display = "none";
}

function deleteProduct(productId) {
    if (confirm("Biztosan törölni szeretnéd ezt a terméket?")) {
        fetch("backend/delete_Product.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ product_id: productId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("A termék törölve lett.");
                loadUserProducts();
            } else {
                alert("Hiba történt: " + data.message);
            }
        })
        .catch(error => console.error("Hálózati hiba:", error));
    }
}
