function updateCart() {
    const cartContent = document.getElementById("cartBtn");
    const cartCount = document.getElementById("cart-count");

    if (!cartContent || !cartCount) {
        console.error("A 'cartBtn' vagy 'cart-count' elem nem található!");
        return;
    }

    fetch("backend/kosarlekero.php")
        .then(response => response.json())
        .then(data => {
            const dropdownMenu = cartContent.querySelector(".dropdown-menu");
            if (!dropdownMenu) {
                console.error("A '.dropdown-menu' elem nem található a 'cartBtn'-ben!");
                return;
            }

            if (data.success && data.sales.length > 0) {
                dropdownMenu.innerHTML = ""; // Töröljük az alapértelmezett üzenetet

                // Kosár tartalmának megjelenítése
                data.sales.forEach(item => {
                    const itemElement = document.createElement("p");
                    itemElement.className = "dropdown-item";

                    // Ellenőrizzük, hogy az item és a name létezik-e
                    if (item.item && item.item.name) {
                        itemElement.innerHTML = `
                            ${item.item.name} -<br>
                            ${formatPrice(item.item.price)} Ft<br>
                            Mennyiség: ${item.quantity}
                        `;
                    } else {
                        itemElement.innerHTML = `
                            Ismeretlen termék -<br>
                            Ár: N/A<br>
                            Mennyiség: ${item.quantity}
                        `;
                    }

                    dropdownMenu.appendChild(itemElement);
                });

                // Frissítsük a kosár darabszámát
                const totalItems = data.sales.reduce((sum, item) => sum + item.quantity, 0);
                cartCount.textContent = totalItems;
                cartCount.classList.remove("opacity-0"); // Láthatóvá tesszük a számlálót

                // Gomb a fizetéshez
                const checkoutButton = document.createElement("a");
                checkoutButton.href = "cart.html";
                checkoutButton.innerHTML = '<button class="dropdown-item">Tovább a fizetéshez</button>';
                dropdownMenu.appendChild(checkoutButton);
            } else {
                // Ha üres a kosár
                dropdownMenu.innerHTML = '<p class="dropdown-item">A kosarad üres!</p>';
                cartCount.textContent = "0";
                cartCount.classList.add("opacity-0"); // Elrejtjük a számlálót
            }
        })
        .catch(error => {
            console.error("Hiba történt a kosár lekérésekor:", error);
        });
}