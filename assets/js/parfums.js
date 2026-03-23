// assets/js/parfums.js
document.addEventListener('DOMContentLoaded', () => {
    const parfumsList = document.getElementById('parfums-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Filter products specifically for the "parfums" category
    const parfumsProducts = products.filter(p => p.category === 'parfums');
    
    if (parfumsList && typeof products !== 'undefined') {
        // Initial render for all parfums
        renderParfums(parfumsProducts);
        
        // Setup filters
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Update active class
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const filterValue = e.target.dataset.filter;
                
                if (filterValue === 'all') {
                    renderParfums(parfumsProducts);
                } else {
                    const filtered = parfumsProducts.filter(p => p.subCategory === filterValue);
                    renderParfums(filtered);
                }
            });
        });
    }
});

function renderParfums(productsToRender) {
    const list = document.getElementById('parfums-list');
    list.innerHTML = '';
    
    if (productsToRender.length === 0) {
        list.innerHTML = `<p style="text-align:center; grid-column:1/-1; padding: 40px;">Aucun produit trouvé dans cette catégorie.</p>`;
        return;
    }
    
    productsToRender.forEach(product => {
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
        
        list.appendChild(card);
    });
}
