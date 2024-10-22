document.addEventListener("DOMContentLoaded", function() {
    const cartTable = document.getElementById("cart-table");
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");
    
    // Simulated API Data
    const apiData = {
        "original_total_price": 250000,
        "items": [
            {
                "id": 49839206859071,
                "quantity": 1,
                "title": "Asgaard sofa",
                "price": 25000000,
                "line_price": 25000000,
                "final_line_price": 25000000,
                "image": "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/Asgaardsofa3.png?v=1728384481",
                "product_description": "The Asgaard sofa offers unparalleled comfort and style with its sleek design and high-quality materials.",
            }
        ],
        "currency": "INR"
    };

    // Fetch Cart Data (simulated with a promise to mimic API fetch)
    function fetchCartData() {
        return new Promise((resolve) => {
            setTimeout(() => resolve(apiData), 1000); // Simulating a 1 second delay
        });
    }

    // Function to render cart items
    function renderCartItems(items) {
        cartTable.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id="cart-items">
                </tbody>
            </table>
        `;
        
        const cartItemsElement = document.getElementById("cart-items");

        items.forEach((item, index) => {
            const itemRow = document.createElement('tr');
            itemRow.innerHTML = `
                <td>
                    <img src="${item.image}" alt="${item.title}" width="60" height="60">
                    ${item.title}
                </td>
                <td>₹${formatCurrency(item.price / 100)}</td>
                <td>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-index="${index}" style="width: 50px;">
                </td>
                <td>₹<span class="line-total">${formatCurrency(item.line_price / 100)}</span></td>
                <td>
                    <i class="fas fa-trash-alt" style="color: #d4a373; cursor: pointer;" data-index="${index}"></i>
                </td>
            `;
            cartItemsElement.appendChild(itemRow);
        });

        // Add event listeners for quantity changes and item removal
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', handleQuantityChange);
        });

        document.querySelectorAll('.fa-trash-alt').forEach(icon => {
            icon.addEventListener('click', handleItemRemove);
        });
    }

    // Function to handle quantity change
    function handleQuantityChange(event) {
        const index = event.target.getAttribute('data-index');
        const newQuantity = parseInt(event.target.value);
        apiData.items[index].quantity = newQuantity;
        apiData.items[index].line_price = apiData.items[index].price * newQuantity;
        updateCartTotals();
        renderCartItems(apiData.items);
    }

    // Function to handle item removal
    function handleItemRemove(event) {
        const index = event.target.getAttribute('data-index');
        apiData.items.splice(index, 1); // Remove the item from the array
        updateCartTotals();
        renderCartItems(apiData.items);
    }

    // Function to calculate and update the subtotal and total
    function updateCartTotals() {
        let subtotal = 0;
        apiData.items.forEach(item => {
            subtotal += item.line_price;
        });
        subtotalElement.textContent = `₹${formatCurrency(subtotal / 100)}`;
        totalElement.textContent = `₹${formatCurrency(subtotal / 100)}`;
    }

    // Function to format currency
    function formatCurrency(amount) {
        return amount.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).replace("₹", ""); // Indian Rupees symbol but with correct formatting
    }

    // Initial cart fetch and render
    fetchCartData().then(data => {
        renderCartItems(data.items);
        updateCartTotals();
    });
});
