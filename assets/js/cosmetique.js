// assets/js/cosmetique.js
document.addEventListener('DOMContentLoaded', () => {
    const cosmetiqueList = document.getElementById('cosmetique-list');
    const filterSelect = document.getElementById('cosmetique-select');
    
    // Filter products specifically for the "cosmetique" category
    const cosmetiqueProducts = products.filter(p => p.category === 'cosmetique');
    
    if (cosmetiqueList && typeof products !== 'undefined') {
        // Initial render for all cosmetique
        renderCosmetique(cosmetiqueProducts);
        
        // Setup filters
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                const filterValue = e.target.value;
                
                if (filterValue === 'all') {
                    renderCosmetique(cosmetiqueProducts);
                } else {
                    const filtered = cosmetiqueProducts.filter(p => p.subCategory === filterValue);
                    renderCosmetique(filtered);
                }
            });
        }
    }
});

function renderCosmetique(productsToRender) {
    const list = document.getElementById('cosmetique-list');
    list.innerHTML = '';
    
    if (productsToRender.length === 0) {
        list.innerHTML = `<p style="text-align:center; grid-column:1/-1; padding: 40px;">Aucun produit cosmétique trouvé dans cette catégorie.</p>`;
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
