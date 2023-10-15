'use strict';

const addCart = async (id, quantity) => {
    let res = await fetch('/products/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ id, quantity })
    });
    let json = await res.json();
    document.getElementById('cart-quantity').innerText = `(${json.quantity})`;
};

const updateCart = async (id, quantity) => {
    if (quantity > 0) {
        let res = await fetch('/products/cart', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ id, quantity })
        });
        if (res.status == 200) {
            let json = await res.json();
            document.getElementById('cart-quantity').innerText = `(${json.quantity})`;
            document.getElementById('subtotal').innerText = `$${json.subtotal}`;
            document.getElementById('total').innerText = `$${json.total}`;
            document.getElementById(`total${id}`).innerText = `$${json.item.total}`;
        }
    } else {
        removeCart(id)
    }
};

const removeCart = async (id) => {
    if (confirm('Do you really want to remove this product?')) {
        let res = await fetch('/products/cart', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ id })
        });
        if (res.status == 200) {
            let json = await res.json();
            document.getElementById('cart-quantity').innerText = `(${json.quantity})`;

            if (json.quantity > 0) {
                document.getElementById('subtotal').innerText = `$${json.subtotal}`;
                document.getElementById('total').innerText = `$${json.total}`;
                document.getElementById(`product${id}`).remove();
            } else {
                document.querySelector('.cart-page .container').innerHTML = `
                    <div class="ext-center border py-3">
                        <h3>Your cart is empty</h3>
                    </div>
                `;
            }
            
        }
    }
};

const clearCart = async () => {
    if (confirm('Do you really want to clear all cart?')) {
        let res = await fetch('/products/cart/all', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        if (res.status == 200) {
            document.getElementById('cart-quantity').innerText = `(0)`;
            document.querySelector('.cart-page .container').innerHTML = `
                <div class="ext-center border py-3">
                    <h3>Your cart is empty</h3>
                </div>
            `;
        }
    }
};

const placeorders = (e) => {
    e.preventDefault();

    const addressId = document.querySelector('input[name=addressId]:checked');
    if (!addressId || addressId.value == 0) {
        if (!e.target.checkValidity()) {
            return e.target.reportValidity();
        }
    }

    e.target.submit();
}