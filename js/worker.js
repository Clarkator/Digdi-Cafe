document.addEventListener('DOMContentLoaded', function() {
    const loginContainer = document.getElementById('loginContainer');
    const dashboard = document.getElementById('dashboard');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logout');
    const pendingOrdersContainer = document.getElementById('pendingOrders');
    const completedOrdersContainer = document.getElementById('completedOrders');
    
    // Worker credentials (in a real app, this would be server-side)
    const workerCredentials = {
        username: "digdiworker",
        password: "coffee123"
    };

    // Check if worker is already logged in
    if (localStorage.getItem('digdiWorkerLoggedIn') === 'true') {
        loginContainer.classList.add('hidden');
        dashboard.classList.remove('hidden');
        loadOrders();
    }

    // Login form handler
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === workerCredentials.username && password === workerCredentials.password) {
            localStorage.setItem('digdiWorkerLoggedIn', 'true');
            loginContainer.classList.add('hidden');
            dashboard.classList.remove('hidden');
            loadOrders();
            window.scrollTo(0, 0);
        } else {
            alert('Invalid username or password');
        }
    });

    // Logout handler
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('digdiWorkerLoggedIn');
        dashboard.classList.add('hidden');
        loginContainer.classList.remove('hidden');
        loginForm.reset();
        window.scrollTo(0, 0);
    });

    // Load orders from localStorage
    function loadOrders() {
        const pendingOrders = getOrdersByStatus('pending');
        const completedOrders = getOrdersByStatus('completed');
        
        pendingOrdersContainer.innerHTML = '';
        completedOrdersContainer.innerHTML = '';
        
        if (pendingOrders.length === 0) {
            pendingOrdersContainer.innerHTML = '<p>No pending orders at the moment.</p>';
        }
        
        if (completedOrders.length === 0) {
            completedOrdersContainer.innerHTML = '<p>No completed orders yet.</p>';
        }
        
        // Display pending orders
        pendingOrders.forEach(order => {
            const orderCard = createOrderCard(order, true);
            pendingOrdersContainer.appendChild(orderCard);
        });
        
        // Display completed orders (sorted by most recent first)
        completedOrders.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                      .forEach(order => {
            const orderCard = createOrderCard(order, false);
            completedOrdersContainer.appendChild(orderCard);
        });
    }

    // Create order card element
    function createOrderCard(order, isPending) {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        orderCard.innerHTML = `
            <h3>${order.coffee.name} (Order #${order.id})</h3>
            <p><strong>Customer:</strong> ${order.customer}</p>
            <p><strong>Location:</strong> ${order.tower}, Floor ${order.floor}, Room ${order.room}</p>
            <p><strong>Payment:</strong> ${order.payment}${order.reference ? ' (Ref: ' + order.reference + ')' : ''}</p>
            <p><strong>Price:</strong> ₱${order.coffee.price.toFixed(2)}</p>
            <p><strong>Ordered at:</strong> ${formatDate(order.createdAt)}</p>
            ${!isPending ? `<p><strong>Completed at:</strong> ${formatDate(order.updatedAt)}</p>` : ''}
            <div class="order-actions">
                ${isPending ? 
                    `<button class="btn complete-btn" data-id="${order.id}">Mark as Complete</button>` : 
                    `<span class="completed-text">Completed</span>`}
            </div>
        `;
        
        return orderCard;
    }

    // Add event listeners to complete buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('complete-btn')) {
            const orderId = parseInt(e.target.getAttribute('data-id'));
            completeOrder(orderId);
        }
    });

    // Complete an order
    function completeOrder(orderId) {
        if (updateOrderStatus(orderId, 'completed')) {
            loadOrders();
            alert(`Order #${orderId} marked as completed!`);
        }
    }

    // Check for new orders periodically
    setInterval(() => {
        if (localStorage.getItem('digdiWorkerLoggedIn') === 'true') {
            loadOrders();
        }
    }, 10000); // Check every 10 seconds
});