// assets/js/cart.js
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

function renderCart() {
    const container = document.getElementById('cart-container');
    const items = Cart.getItems();

    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>Votre panier est vide</h3>
                <p>Découvrez nos produits artisanaux et ajoutez-les à votre panier.</p>
                <a href="index.html" class="btn btn-primary">Continuer mes achats</a>
            </div>
        `;
        return;
    }

    let itemsHtml = items.map(item => {
        const colorText = item.color ? `Couleur: ${item.color}` : '';
        return `
            <div class="cart-item" data-id="${item.id}" data-color="${item.color || ''}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-meta">${colorText}</p>
                    <div class="cart-actions">
                        <div class="quantity-wrap" style="transform: scale(0.85); transform-origin: left;">
                            <button type="button" class="qty-btn btn-minus-cart">−</button>
                            <input type="number" class="qty-input qty-input-cart" value="${item.quantity}" min="1" max="99" readonly>
                            <button type="button" class="qty-btn btn-plus-cart">+</button>
                        </div>
                        <div class="cart-item-price">${formatPrice(item.price * item.quantity)}</div>
                        <button class="remove-btn">Supprimer</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    const total = Cart.getTotal();

    container.innerHTML = `
        <div class="cart-layout">
            <div class="cart-items">
                ${itemsHtml}
            </div>
            
            <div class="cart-summary">
                <h3 style="margin-bottom: 20px;">Récapitulatif</h3>
                <div class="summary-row">
                    <span>Sous-total</span>
                    <span>${formatPrice(total)}</span>
                </div>
                <div class="summary-row">
                    <span>Livraison</span>
                    <span>Calculée sur WhatsApp</span>
                </div>
                <div class="summary-row summary-total">
                    <span>Total estimé</span>
                    <span>${formatPrice(total)}</span>
                </div>
                
                <form id="checkout-form" class="checkout-form">
                    <label for="client-name">Nom complet *</label>
                    <input type="text" id="client-name" class="input-box" required placeholder="Votre nom">
                    
                    <label for="client-whatsapp">Numéro WhatsApp *</label>
                    <input type="tel" id="client-whatsapp" class="input-box" required placeholder="Numero whatsapp">
                    
                    <button type="submit" class="btn btn-whatsapp" style="margin-top: 10px; width: 100%;">
                        Commander sur WhatsApp
                    </button>
                </form>
            </div>
        </div>
    `;

    setupCartListeners();
}

function setupCartListeners() {
    // Quantity adjustments
    const minusBtns = document.querySelectorAll('.btn-minus-cart');
    const plusBtns = document.querySelectorAll('.btn-plus-cart');
    const removeBtns = document.querySelectorAll('.remove-btn');

    minusBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemElement = e.target.closest('.cart-item');
            const id = itemElement.dataset.id;
            const color = itemElement.dataset.color || null;
            const input = itemElement.querySelector('.qty-input-cart');
            let val = parseInt(input.value);

            if (val > 1) {
                Cart.updateQuantity(id, color, val - 1);
                renderCart();
            }
        });
    });

    plusBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemElement = e.target.closest('.cart-item');
            const id = itemElement.dataset.id;
            const color = itemElement.dataset.color || null;
            const input = itemElement.querySelector('.qty-input-cart');
            let val = parseInt(input.value);

            if (val < 99) {
                Cart.updateQuantity(id, color, val + 1);
                renderCart();
            }
        });
    });

    // Removals
    removeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemElement = e.target.closest('.cart-item');
            const id = itemElement.dataset.id;
            const color = itemElement.dataset.color || null;
            Cart.removeItem(id, color);
            renderCart();
        });
    });

    // Checkout form
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            generateWhatsAppOrder();
        });
    }
}

function generateWhatsAppOrder() {
    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-whatsapp').value.trim();
    const items = Cart.getItems();
    const total = Cart.getTotal();

    if (!name || !phone) {
        showToast("Veuillez remplir tous les champs");
        return;
    }

    const orderNumber = 'CMD-' + Math.floor(Math.random() * 1000000);

    let message = `*NOUVELLE COMMANDE* 🛍️\n`;
    message += `Numéro : ${orderNumber}\n\n`;
    message += `*Client :* ${name}\n`;
    message += `*Téléphone :* ${phone}\n\n`;
    message += `*Détails de la commande :*\n`;

    items.forEach((item, index) => {
        message += `${index + 1}. ${item.name}`;
        if (item.color) message += ` (${item.color})`;
        message += `\n   ➤ ${item.quantity} x ${formatPrice(item.price)}\n`;
    });

    message += `\n*Total de la commande : ${formatPrice(total)}*\n\n`;
    message += `Merci de confirmer ma commande !`;

    const targetNumber = "212782830238";
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${targetNumber}?text=${encodedMessage}`;

    window.open(waUrl, '_blank');
}
