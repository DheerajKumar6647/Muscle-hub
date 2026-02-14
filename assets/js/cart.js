// Cart items ko local storage se nikalna
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Cart display function
function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    const totalContainer = document.getElementById('cart-total');
    if (!cartContainer) return;

    const cart = getCart();
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = "<tr><td colspan='5'>Aapka cart khali hai!</td></tr>";
        totalContainer.innerText = "0";
        return;
    }

    cartContainer.innerHTML = cart.map((item, index) => {
        total += item.price * item.quantity;
        return `
            <tr>
                <td><img src="${item.image}" width="50"></td>
                <td>${item.name}</td>
                <td>₹${item.price}</td>
                <td>
                    <button onclick="updateQty(${index}, -1)">-</button>
                    ${item.quantity}
                    <button onclick="updateQty(${index}, 1)">+</button>
                </td>
                <td>₹${item.price * item.quantity}</td>
                <td><button onclick="removeItem(${index})">❌</button></td>
            </tr>
        `;
    }).join('');

    totalContainer.innerText = total;
}

function updateQty(index, change) {
    let cart = getCart();
    cart[index].quantity += change;
    if (cart[index].quantity < 1) cart[index].quantity = 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function removeItem(index) {
    let cart = getCart();
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

document.addEventListener('DOMContentLoaded', renderCart);