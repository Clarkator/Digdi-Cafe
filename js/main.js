// Shared functions between customer and worker pages

// Function to save order to localStorage
function saveOrder(order) {
    let orders = JSON.parse(localStorage.getItem('digdiCafeOrders')) || [];
    // Add unique ID to each order
    order.id = Date.now();
    orders.push(order);
    localStorage.setItem('digdiCafeOrders', JSON.stringify(orders));
    return order.id;
}

// Function to get all orders
function getAllOrders() {
    return JSON.parse(localStorage.getItem('digdiCafeOrders')) || [];
}

// Function to update order status
function updateOrderStatus(orderId, status) {
    let orders = getAllOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        orders[orderIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('digdiCafeOrders', JSON.stringify(orders));
        return true;
    }
    return false;
}

// Function to get orders by status
function getOrdersByStatus(status) {
    const orders = getAllOrders();
    return orders.filter(order => order.status === status);
}

// Function to format date
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}