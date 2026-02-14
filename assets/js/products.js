const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd5NGZCVcW_SUH4FIpMbS5JW9o7sdfrMb6-B1hAlosLTUS3L4zpq9UvzkAZRxhCMO_it_GfYLl3aIB/pub?output=csv"; 

let allProducts = [];

async function loadProducts() {
    try {
        const response = await fetch(SHEET_URL);
        const data = await response.text();
        
        // Advance logic: Jo comma "quotes" ke andar hain unhe ignore karega
        const rows = data.split('\n').map(row => {
            const re = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
            return row.split(re);
        }).filter(row => row.length > 1);

        allProducts = rows.slice(1).map(cols => {
            return {
                id: cols[0].replace(/"/g, '').trim(),
                name: cols[1].replace(/"/g, '').trim(),
                category: cols[2].replace(/"/g, '').trim(),
                price: cols[3].replace(/"/g, '').trim(),
                image: cols[4].replace(/"/g, '').trim(),
                description: cols[5].replace(/"/g, '').trim()
            };
        });

        displayProducts(allProducts);
    } catch (error) {
        console.error("Error:", error);
    }
}

function displayProducts(products) {
    const container = document.getElementById('featured-products');
    if (!container) return;

    container.innerHTML = products.map(item => `
        <div class="product-card">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/400x400/1a1a1a/ffffff?text=Image+Not+Found'">
            <div class="product-info">
                <h3>${item.name}</h3>
                <p class="category">${item.category}</p>
                <p class="price">₹${item.price}</p>
                <button onclick="addToCart('${item.id}')" class="btn-primary">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', loadProducts);







// Is line ko products.js mein sabse niche ya addToCart ki jagah paste karein
window.addToCart = function(productId) {
    // 1. Product ko dhundna (String comparison ke saath)
    const product = allProducts.find(p => String(p.id).trim() === String(productId).trim());
    
    if (!product) {
        console.error("Product nahi mila! ID check karein:", productId);
        return;
    }

    // 2. LocalStorage se cart nikalna
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // 3. Check karna ki item pehle se hai ya nahi
    const existingItem = cart.find(item => String(item.id).trim() === String(productId).trim());

    if (existingItem) {
        existingItem.quantity = (parseInt(existingItem.quantity) || 1) + 1;
    } else {
        // Naya item add karna
        cart.push({
            id: product.id,
            name: product.name,
            price: parseInt(product.price), // Price ko number banana zaroori hai
            image: product.image,
            quantity: 1
        });
    }

    // 4. Save karna aur user ko batana
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Alert ki jagah ek sundar notification (Optional)
    alert(`${product.name} cart mein add ho gaya!`);
    
    // Header mein cart number update karne ke liye
    updateCartBadge();
};

// Cart badge update karne ka function
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.innerText = count;
}

// Page load par badge dikhao
document.addEventListener('DOMContentLoaded', updateCartBadge);