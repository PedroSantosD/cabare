function showDetails(name, description, image, price, location) {
    document.getElementById('modal-title').innerText = name;
    document.getElementById('modal-description').innerText = description;
    document.getElementById('modal-image').src = image;
    document.getElementById('modal-price').innerText = `Valor: ${price}`;
    document.getElementById('modal-location').innerText = `Local: ${location}`;
    document.getElementById('modal').style.display = "block";
}

function closeModal() {
    document.getElementById('modal').style.display = "none";
}

// Fechar o modal ao clicar fora dele
window.onclick = function(event) {
    if (event.target == document.getElementById('modal')) {
        closeModal();
    }
}

// Adicionando interação ao formulário de pagamento
document.getElementById('payment-form').onsubmit = function(event) {
    event.preventDefault();
    alert("Pagamento realizado com sucesso!");
    this.reset();
};
// Inicialize o Stripe
const stripe = Stripe('sua_chave_publica'); // Chave pública do Stripe
const elements = stripe.elements();

const cardElement = elements.create('card');
cardElement.mount('#card-element');

document.getElementById('payment-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const serviceSelect = document.getElementById('service');
    const servicePrice = serviceSelect.options[serviceSelect.selectedIndex].value.split(' - ')[1].replace('R$', '').replace(',', '');
    
    const { clientSecret } = await fetch('http://localhost:3000/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: servicePrice * 100, currency: 'brl' }) // Valor em centavos
    }).then(res => res.json());

    const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: cardElement,
            billing_details: {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
            },
        },
    });

    if (error) {
        alert(error.message);
    } else {
        window.location.href = 'success.html';
    }
});

document.getElementById('pix-button').addEventListener('click', () => {
    alert('Instruções para pagamento via Pix foram enviadas para seu email.');
});
