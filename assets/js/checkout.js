


function placeOrder(event) {
    event.preventDefault();
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert("Cart khali hai, pehle shop karein!");
        return;
    }

    // Form Details
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const pincode = document.getElementById('pincode').value;

    // Order ID Generator
    const orderId = "MH-" + Math.floor(10000 + Math.random() * 90000);
    
    let total = 0;
    let itemDetails = "";

    cart.forEach(item => {
        itemDetails += `%0A- ${item.name} (Qty: ${item.quantity}) = ₹${item.price * item.quantity}`;
        total += item.price * item.quantity;
    });

    // WhatsApp Message Format
    const message = `*NEW ORDER FROM MUSCLE HUB*%0A%0A` +
        `*Order ID:* ${orderId}%0A` +
        `*Customer:* ${name}%0A` +
        `*Phone:* ${phone}%0A` +
        `*Address:* ${address}, ${pincode}%0A%0A` +
        `*Items:* ${itemDetails}%0A%0A` +
        `*Total Amount:* ₹${total}%0A` +
        `*Payment Mode:* Cash on Delivery%0A%0A` +
        `Please confirm my order!`;

    const whatsappNumber = "919559896647"; 
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    // Order details save karke redirect karna
    localStorage.setItem('lastOrder', JSON.stringify({ orderId, total }));
    localStorage.removeItem('cart'); // Order ke baad cart khali

    window.open(whatsappUrl, '_blank');
    window.location.href = 'success.html';

}
