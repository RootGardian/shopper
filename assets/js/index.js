// assets/js/index.js
document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const filterSelect = document.getElementById('index-category-select');
    
    if (productList && typeof products !== 'undefined') {
        renderProducts(products);
        
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                const category = e.target.value;
                if (category === 'all') {
                    renderProducts(products);
                } else {
                    const filtered = products.filter(p => p.category === category);
                    renderProducts(filtered);
                }
            });
        }
    }
});

function renderProducts(productsArray) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    
    productsArray.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <a href="product-detail.html?id=${product.id}" class="product-img-wrap">
                <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
            </a>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">${formatPrice(product.price)}</div>
                <div class="product-actions">
                    <a href="product-detail.html?id=${product.id}" class="btn">Voir le produit</a>
                </div>
            </div>
        `;
        
        productList.appendChild(card);
    });
}
