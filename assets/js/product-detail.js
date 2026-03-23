// assets/js/product-detail.js
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    const container = document.getElementById('product-container');
    
    if (!productId || typeof products === 'undefined') {
        showError(container);
        return;
    }
    
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showError(container);
        return;
    }
    
    renderProductDetail(container, product);
    
    // Update document title
    document.title = `${product.name} - Morocco Shopper`;
});

function showError(container) {
    container.innerHTML = `
        <div class="empty-state">
            <h3>Produit introuvable</h3>
            <p>Le produit que vous cherchez n'existe pas ou n'est plus disponible.</p>
            <a href="index.html" class="btn btn-primary">Retour à l'accueil</a>
        </div>
    `;
}

function renderProductDetail(container, product) {
    let colorOptionsHtml = '';
    
    if (product.colors && product.colors.length > 0) {
        const options = product.colors.map(c => `<option value="${c}">${c}</option>`).join('');
        colorOptionsHtml = `
            <div class="options-group">
                <label for="color-select">Couleur / Motif</label>
                <select id="color-select" class="select-box">
                    ${options}
                </select>
            </div>
        `;
    } else if (product.category === 'parfums') {
        colorOptionsHtml = `
            <div class="options-group">
                <label for="color-select">Contenance / Volume</label>
                <select id="color-select" class="select-box">
                    <option value="125ml" selected>125ml</option>
                    <option value="63ml">63ml</option>
                    <option value="250ml">250ml</option>
                    <option value="500ml">500ml</option>
                    <option value="1 Litre">1 Litre</option>
                </select>
            </div>
        `;
    }
    
    container.innerHTML = `
        <div class="product-detail-layout">
            <div class="detail-gallery">
                <img src="${product.image}" alt="${product.name}" class="detail-img">
            </div>
            
            <div class="detail-content">
                <h1>${product.name}</h1>
                <div class="detail-price">${formatPrice(product.price)}</div>
                <div class="detail-desc">${product.description}</div>
                
                ${colorOptionsHtml}
                
                <div class="options-group">
                    <label>Quantité</label>
                    <div class="quantity-wrap">
                        <button type="button" class="qty-btn" id="btn-minus">−</button>
                        <input type="number" id="qty-input" class="qty-input" value="1" min="1" max="99" readonly>
                        <button type="button" class="qty-btn" id="btn-plus">+</button>
                    </div>
                </div>
                
                <div class="add-cart-wrap">
                    <button type="button" class="btn btn-primary" id="btn-add-cart">Ajouter au panier</button>
                    <a href="cart.html" class="btn">Voir mon panier</a>
                </div>
            </div>
        </div>
    `;
    
    setupEventListeners(product);
}

function setupEventListeners(product) {
    const btnMinus = document.getElementById('btn-minus');
    const btnPlus = document.getElementById('btn-plus');
    const inputQty = document.getElementById('qty-input');
    const btnAddCart = document.getElementById('btn-add-cart');
    const colorSelect = document.getElementById('color-select');
    const priceDisplay = document.querySelector('.detail-price');
    
    let currentMultiplier = 1;

    if (product.category === 'parfums' && colorSelect) {
        colorSelect.addEventListener('change', () => {
            const vol = colorSelect.value;
            if (vol === '63ml') currentMultiplier = 0.5;
            if (vol === '125ml') currentMultiplier = 1;
            if (vol === '250ml') currentMultiplier = 2;
            if (vol === '500ml') currentMultiplier = 4;
            if (vol === '1 Litre') currentMultiplier = 8;
            
            priceDisplay.textContent = formatPrice(product.price * currentMultiplier);
        });
    }
    
    btnMinus.addEventListener('click', () => {
        let val = parseInt(inputQty.value);
        if (val > 1) inputQty.value = val - 1;
    });
    
    btnPlus.addEventListener('click', () => {
        let val = parseInt(inputQty.value);
        if (val < 99) inputQty.value = val + 1;
    });
    
    btnAddCart.addEventListener('click', () => {
        const qty = parseInt(inputQty.value);
        const color = colorSelect ? colorSelect.value : null;
        
        const itemToAdd = { ...product, price: product.price * currentMultiplier };
        Cart.addItem(itemToAdd, qty, color);
    });
}
