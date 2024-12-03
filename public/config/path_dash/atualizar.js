// Importa os módulos específicos do Firebase (v9+ modular)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getDatabase, ref, onValue, set, query, orderByChild } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import firebaseConfig from '../FireBase/CONFIG.js';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Função para detectar mudanças no estado de autenticação
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadUserProducts(user.uid);
    } else {
        alert('Usuário não autenticado');
    }
});

// Função para carregar produtos
function loadUserProducts(userId) {
    const productListDiv = document.getElementById('product-list');
    const productSelect = document.getElementById('select-product');
    productListDiv.innerHTML = '';
    productSelect.innerHTML = '';

    const productsRef = ref(db, `users/${userId}/products`);
    onValue(productsRef, (snapshot) => {
        const products = snapshot.val();
        if (products) {
            Object.keys(products).forEach(productId => {
                const product = products[productId];

                const productDiv = document.createElement('div');
                productDiv.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>Descrição do Produto (Bloco 1): ${product.description}</p>
                `;
                productListDiv.appendChild(productDiv);

                const option = document.createElement('option');
                option.value = productId;
                option.textContent = product.name;
                productSelect.appendChild(option);

                loadProductBlocks(userId, productId, productDiv);
            });

            document.getElementById('new-block-section').style.display = 'block';
        } else {
            productListDiv.innerHTML = '<p>Nenhum produto cadastrado.</p>';
        }
    });
}

// Função para carregar blocos
function loadProductBlocks(userId, productId, productDiv) {
    const productBlocksRef = ref(db, `users/${userId}/products/${productId}/blocks`);
    const productBlocksQuery = query(productBlocksRef, orderByChild('timestamp'));

    onValue(productBlocksQuery, (snapshot) => {
        const blocks = snapshot.val();
        if (blocks) {
            Object.keys(blocks).forEach(blockId => {
                const block = blocks[blockId];
                const blockDiv = document.createElement('div');
                blockDiv.innerHTML = `
                    <h4>Bloco ${block.id}</h4>
                    <p>Quantidade: ${block.quantity} MG</p>
                    <p>Data de Uso: ${block.date}</p>
                    <p>Descrição do Bloco: ${block.description}</p>
                `;
                productDiv.appendChild(blockDiv);
            });
        }
    });
}

// Formulário de novo bloco
const blockForm = document.getElementById('block-form');
blockForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const productId = document.getElementById('select-product').value;
    const quantity = document.getElementById('block-quantity').value;
    const date = document.getElementById('block-date').value;
    const description = document.getElementById('block-description').value;

    if (!productId || !quantity || !date || !description) {
        alert('Preencha todos os campos.');
        return;
    }

    const userId = auth.currentUser.uid;
    const productBlocksRef = ref(db, `users/${userId}/products/${productId}/blocks`);

    // Obtém a contagem de blocos existentes e adiciona o novo bloco
    onValue(productBlocksRef, (snapshot) => {
        const existingBlocks = snapshot.val() || {};
        const blockCount = Object.keys(existingBlocks).length + 1;

        const newBlockData = {
            id: blockCount,
            quantity: quantity,
            date: date,
            description: description,
            previousBlockId: blockCount > 1 ? blockCount - 1 : null,
            timestamp: Date.now()
        };

        set(ref(db, `users/${userId}/products/${productId}/blocks/block_${blockCount}`), newBlockData)
            .then(() => {
                alert('Bloco adicionado com sucesso!');
                blockForm.reset();
            })
            .catch((error) => {
                console.error('Erro ao adicionar bloco:', error);
            });
    }, { onlyOnce: true });
});
