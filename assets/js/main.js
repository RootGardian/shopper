// assets/js/main.js

/**
 * Utility: Format price to MAD (Moroccan Dirham)
 */
function formatPrice(price) {
    return price.toLocaleString('fr-MA', { style: 'currency', currency: 'MAD' });
}

/**
 * Cart Manager Singleton using localStorage
 */
const Cart = {
    getKey: () => 'morocco_shopper_cart',
    
    getItems: function() {
        const data = localStorage.getItem(this.getKey());
        return data ? JSON.parse(data) : [];
    },
    
    saveItems: function(items) {
        localStorage.setItem(this.getKey(), JSON.stringify(items));
        this.updateCartCounter();
    },
    
    addItem: function(product, quantity = 1, color = null) {
        let items = this.getItems();
        // Check if item already in cart with same color
        const existingIndex = items.findIndex(item => item.id === product.id && item.color === color);
        
        if (existingIndex > -1) {
            items[existingIndex].quantity += quantity;
        } else {
            items.push({
                ...product,
                quantity: quantity,
                color: color
            });
        }
        
        this.saveItems(items);
        showToast("Produit ajouté au panier !");
    },
    
    removeItem: function(id, color) {
        let items = this.getItems();
        items = items.filter(item => !(item.id === id && item.color === color));
        this.saveItems(items);
    },
    
    updateQuantity: function(id, color, newQuantity) {
        if (newQuantity < 1) return;
        let items = this.getItems();
        const index = items.findIndex(item => item.id === id && item.color === color);
        if (index > -1) {
            items[index].quantity = newQuantity;
            this.saveItems(items);
        }
    },
    
    getTotal: function() {
        return this.getItems().reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    getTotalCount: function() {
        return this.getItems().reduce((total, item) => total + item.quantity, 0);
    },
    
    updateCartCounter: function() {
        const counters = document.querySelectorAll('.cart-count');
        const count = this.getTotalCount();
        counters.forEach(counter => {
            counter.innerText = count;
            counter.style.display = count > 0 ? 'flex' : 'none';
        });
    }
};

/**
 * Toast Notification system
 */
function showToast(message) {
    const container = document.getElementById('toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

/**
 * Inject Floating WhatsApp Button
 */
function injectWhatsAppButton() {
    const fab = document.createElement('a');
    fab.href = 'https://wa.me/212782830238?text=' + encodeURIComponent('Bonjour, j\'ai une question.');
    fab.target = '_blank';
    fab.className = 'fab-whatsapp';
    fab.setAttribute('aria-label', 'Contact us on WhatsApp');
    
    // WhatsApp SVG icon
    fab.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825 0 6.938 3.112 6.938 6.937 0 3.825-3.113 6.938-6.938 6.938z"/>
        </svg>
    `;
    
    document.body.appendChild(fab);
}

// Initialize common features
document.addEventListener('DOMContentLoaded', () => {
    Cart.updateCartCounter();
    injectWhatsAppButton();
});
