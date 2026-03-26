// assets/js/abayas-jellabas.js
document.addEventListener('DOMContentLoaded', () => {
    const vetementsList = document.getElementById('vetements-list');
    const filterBtns = document.querySelectorAll('#vetements-filters .filter-btn');
    
    // Filter products specifically for the "vetements" category
    const vetementsProducts = products.filter(p => p.category === 'vetements');
    
    if (vetementsList && typeof products !== 'undefined') {
        // Initial render for all vetements
        renderVetements(vetementsProducts);
        
        // Setup filters
        if (filterBtns && filterBtns.length > 0) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // Update active class
                    filterBtns.forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    
                    const filterValue = e.target.dataset.filter;
                    
                    if (filterValue === 'all') {
                        renderVetements(vetementsProducts);
                    } else {
                        const filtered = vetementsProducts.filter(p => p.subCategory === filterValue);
                        renderVetements(filtered);
                    }
                });
            });
        }
    }
});

function renderVetements(productsToRender) {
    const list = document.getElementById('vetements-list');
    list.innerHTML = '';
    
    if (productsToRender.length === 0) {
        list.innerHTML = `<p style="text-align:center; grid-column:1/-1; padding: 40px;">Aucun vêtement trouvé dans cette catégorie.</p>`;
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
