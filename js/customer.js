document.addEventListener('DOMContentLoaded', function() {
    // Coffee menu data
    const coffeeMenu = [
        { id: 1, name: "Espresso", description: "Strong black coffee", price: 120 },
        { id: 2, name: "Cappuccino", description: "Espresso with steamed milk foam", price: 150 },
        { id: 3, name: "Latte", description: "Espresso with a lot of steamed milk", price: 160 },
        { id: 4, name: "Americano", description: "Espresso with hot water", price: 130 },
        { id: 5, name: "Mocha", description: "Espresso with chocolate and steamed milk", price: 170 },
        { id: 6, name: "Flat White", description: "Espresso with microfoam", price: 150 },
        { id: 7, name: "Macchiato", description: "Espresso with a dollop of milk foam", price: 140 },
        { id: 8, name: "Cold Brew", description: "Slow-steeped cold coffee", price: 160 }
    ];

    const coffeeItemsContainer = document.querySelector('.coffee-items');
    const orderForm = document.getElementById('orderForm');
    const orderConfirmation = document.getElementById('orderConfirmation');
    const orderDetails = document.getElementById('orderDetails');
    const paymentMethod = document.getElementById('payment');
    const gcashPayment = document.getElementById('gcashPayment');
    const cancelOrderBtn = document.getElementById('cancelOrder');
    const newOrderBtn = document.getElementById('newOrder');
    
    let selectedCoffee = null;

    // Display coffee menu
    function displayCoffeeMenu() {
        coffeeItemsContainer.innerHTML = '';
        coffeeMenu.forEach(coffee => {
            const coffeeItem = document.createElement('div');
            coffeeItem.className = 'coffee-item';
            coffeeItem.innerHTML = `
                <h3>${coffee.name}</h3>
                <p>${coffee.description}</p>
                <p class="price">₱${coffee.price.toFixed(2)}</p>
                <button class="btn" data-id="${coffee.id}">Order Now</button>
            `;
            coffeeItemsContainer.appendChild(coffeeItem);
        });

        // Add event listeners to order buttons
        document.querySelectorAll('.coffee-item button').forEach(button => {
            button.addEventListener('click', function() {
                const coffeeId = parseInt(this.getAttribute('data-id'));
                selectedCoffee = coffeeMenu.find(item => item.id === coffeeId);
                document.querySelector('.menu').classList.add('hidden');
                document.querySelector('.order-form').classList.remove('hidden');
                window.scrollTo(0, 0);
            });
        });
    }

    // Payment method change handler
    paymentMethod.addEventListener('change', function() {
        if (this.value === 'GCash') {
            gcashPayment.classList.remove('hidden');
            document.getElementById('reference').required = true;
        } else {
            gcashPayment.classList.add('hidden');
            document.getElementById('reference').required = false;
        }
    });

    // Cancel order handler
    cancelOrderBtn.addEventListener('click', function() {
        document.querySelector('.order-form').classList.add('hidden');
        document.querySelector('.menu').classList.remove('hidden');
        orderForm.reset();
        selectedCoffee = null;
        window.scrollTo(0, 0);
    });

    // New order handler
    newOrderBtn.addEventListener('click', function() {
        orderConfirmation.classList.add('hidden');
        document.querySelector('.menu').classList.remove('hidden');
        window.scrollTo(0, 0);
    });

    // Form submission handler
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const order = {
            coffee: selectedCoffee,
            customer: document.getElementById('name').value,
            tower: document.getElementById('tower').value,
            floor: document.getElementById('floor').value,
            room: document.getElementById('room').value,
            payment: document.getElementById('payment').value,
            reference: document.getElementById('payment').value === 'GCash' ? document.getElementById('reference').value : null,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Save order
        const orderId = saveOrder(order);
        
        // Show confirmation
        document.querySelector('.order-form').classList.add('hidden');
        orderDetails.innerHTML = `
            <p><strong>Coffee:</strong> ${order.coffee.name}</p>
            <p><strong>Price:</strong> ₱${order.coffee.price.toFixed(2)}</p>
            <p><strong>Location:</strong> ${order.tower}, Floor ${order.floor}, Room ${order.room}</p>
            <p><strong>Payment Method:</strong> ${order.payment}${order.reference ? ' (Ref: ' + order.reference + ')' : ''}</p>
            <p><strong>Order ID:</strong> ${orderId}</p>
        `;
        orderConfirmation.classList.remove('hidden');
        
        // Reset form
        orderForm.reset();
        selectedCoffee = null;
        window.scrollTo(0, 0);
    });

    // Initialize the page
    displayCoffeeMenu();
});