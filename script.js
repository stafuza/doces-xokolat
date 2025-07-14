// Dados dos produtos
const products = [
    { id: 'cocada', name: 'COCADA (P/B)', price: 2.50 },
    { id: 'doce_batido', name: 'DOCE D L. BATIDO', price: 2.50 },
    { id: 'pacoca_rolhao', name: 'PAÇOCA ROLHÃO', price: 2.50 },
    { id: 'pacoca_quadrada', name: 'PAÇOCA QUADRADA', price: 2.50 },
    { id: 'geleia_mocoto', name: 'GELEIA DE MOCOTÓ', price: 2.50 },
    { id: 'torrone', name: 'TORRONE', price: 2.50 },
    { id: 'pe_moca', name: 'PÉ DE MOÇA', price: 2.50 },
    { id: 'bolo_salgado', name: 'BOLO SALGADO', price: 8.00 },
    { id: 'amendoim_doce', name: 'AMENDOIM DOCE', price: 3.00 },
    { id: 'amendoim_salg', name: 'AMENDOIM SALGADO', price: 3.00 },
    { id: 'chiclete', name: 'CHICLETE', price: 0.50 },
    { id: 'mini_trufa', name: 'MINI TRUFA (morango, côco e beijinho)', price: 3.00 },
    { id: 'salgado', name: 'SALGADO', price: 1.00 },
    { id: 'lanche', name: 'LANCHE', price: 1.00 },
    { id: 'salgadinho', name: 'SALGADINHO', price: 1.00 },
    { id: 'refrigerante', name: 'REFRIGERANTE', price: 1.00 }
];

// Estado da aplicação
let quantities = {};
let customerName = '';

// Elementos DOM
const customerNameInput = document.getElementById('customer-name');
const productsContainer = document.querySelector('.products-list');
const totalValueElement = document.getElementById('total-value');
const finishButton = document.getElementById('finish-btn');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeProducts();
    setupEventListeners();
    updateTotal();
    updateFinishButton();
});

// Configurar event listeners
function setupEventListeners() {
    customerNameInput.addEventListener('input', function(e) {
        customerName = e.target.value.trim();
        updateFinishButton();
    });
}

// Inicializar produtos na interface
function initializeProducts() {
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        quantities[product.id] = 0;
        
        const productElement = document.createElement('div');
        productElement.className = 'product-item';
        productElement.innerHTML = `
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">R$ ${product.price.toFixed(2)}</div>
            </div>
            <div class="quantity-controls">
                <button 
                    class="quantity-btn" 
                    onclick="updateQuantity('${product.id}', -1)"
                    id="minus-${product.id}"
                    disabled
                >
                    −
                </button>
                <span class="quantity-display" id="qty-${product.id}">0</span>
                <button 
                    class="quantity-btn" 
                    onclick="updateQuantity('${product.id}', 1)"
                >
                    +
                </button>
            </div>
        `;
        
        productsContainer.appendChild(productElement);
    });
}

// Atualizar quantidade de um produto
function updateQuantity(productId, change) {
    const currentQty = quantities[productId] || 0;
    const newQty = Math.max(0, currentQty + change);
    
    quantities[productId] = newQty;
    
    // Atualizar display da quantidade
    document.getElementById(`qty-${productId}`).textContent = newQty;
    
    // Atualizar estado do botão de diminuir
    const minusButton = document.getElementById(`minus-${productId}`);
    minusButton.disabled = newQty === 0;
    
    // Atualizar total e botão finalizar
    updateTotal();
    updateFinishButton();
}

// Calcular e atualizar o total
function calculateTotal() {
    return products.reduce((total, product) => {
        const qty = quantities[product.id] || 0;
        return total + (qty * product.price);
    }, 0);
}

function updateTotal() {
    const total = calculateTotal();
    totalValueElement.textContent = `R$ ${total.toFixed(2)}`;
}

// Atualizar estado do botão finalizar
function updateFinishButton() {
    const hasCustomerName = customerName.length > 0;
    const hasProducts = calculateTotal() > 0;
    
    finishButton.disabled = !hasCustomerName || !hasProducts;
}

// Limpar pedido
function clearOrder() {
    // Limpar nome do cliente
    customerNameInput.value = '';
    customerName = '';
    
    // Limpar quantidades
    products.forEach(product => {
        quantities[product.id] = 0;
        document.getElementById(`qty-${product.id}`).textContent = '0';
        document.getElementById(`minus-${product.id}`).disabled = true;
    });
    
    // Atualizar total e botão
    updateTotal();
    updateFinishButton();
}

// Finalizar pedido
function finishOrder() {
    if (!customerName || calculateTotal() === 0) {
        alert('Por favor, preencha o nome do cliente e adicione produtos ao pedido.');
        return;
    }
    
    // Criar resumo do pedido
    let orderSummary = `NOME - ${customerName}\n\n`;
    orderSummary += 'PRODUTOS:\n';
    
    let hasProducts = false;
    products.forEach(product => {
        const qty = quantities[product.id];
        if (qty > 0) {
            hasProducts = true;
            const subtotal = qty * product.price;
            orderSummary += `${qty}x ${product.name} - R$ ${subtotal.toFixed(2)}\n`;
        }
    });
    
    if (hasProducts) {
        orderSummary += `\nTOTAL: R$ ${calculateTotal().toFixed(2)}`;
        orderSummary += '\n\nDoces do Xokolat - 17-996333055';
        
        alert(orderSummary);
        
        // Opcionalmente, limpar o pedido após finalizar
        if (confirm('Deseja limpar o pedido para um novo cliente?')) {
            clearOrder();
        }
    }
}

// Função para copiar pedido (funcionalidade extra)
function copyOrder() {
    if (!customerName || calculateTotal() === 0) {
        return;
    }
    
    let orderText = `Pedido do *${customerName}*\n\n`;
    
    products.forEach(product => {
        const qty = quantities[product.id];
        if (qty > 0) {
            const subtotal = qty * product.price;
            orderText += `${qty}x ${product.name} - R$ ${subtotal.toFixed(2)}\n`;
        }
    });
    
    orderText += `\nTOTAL: R$ ${calculateTotal().toFixed(2)}`;
    orderText += '\n\nDoces do Xokolat - 17-996333055';
    
    // Tentar copiar para a área de transferência
    if (navigator.clipboard) {
        navigator.clipboard.writeText(orderText).then(() => {
            alert('Pedido copiado para a área de transferência!');
        }).catch(() => {
            // Fallback se não conseguir copiar
            prompt('Copie o texto abaixo:', orderText);
        });
    } else {
        // Fallback para navegadores mais antigos
        prompt('Copie o texto abaixo:', orderText);
    }
}

