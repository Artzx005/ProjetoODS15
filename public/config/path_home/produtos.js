// produtos.js
import firebaseConfig from '../FireBase/CONFIG.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';

// Inicializando Firebase com a versão compatível
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let allProducts = [];
let currentPage = 1;
const productsPerPage = 12;

// Função para carregar todos os produtos
function loadAllProducts() {
    const productListDiv = document.getElementById('product-list');
    productListDiv.innerHTML = '';

    const productsRef = db.ref('users');

    productsRef.once('value', (snapshot) => {
        const usersData = snapshot.val();
        if (usersData) {
            allProducts = [];

            // Percorre todos os usuários e seus produtos
            Object.keys(usersData).forEach(userId => {
                const user = usersData[userId];
                const userProducts = user.products || {};

                Object.keys(userProducts).forEach(productId => {
                    const product = userProducts[productId];
                    const lastBlockId = Object.keys(product.blocks || {}).pop();
                    const lastBlock = product.blocks ? product.blocks[lastBlockId] : null;

                    allProducts.push({
                        ...product,
                        lastBlockDescription: lastBlock ? lastBlock.description : 'Sem descrição',
                        productId,
                        userId 
                    });
                });
            });

            displayProducts(allProducts);
            setupPagination(allProducts);
        } else {
            productListDiv.innerHTML = '<p>Nenhum produto cadastrado.</p>';
        }
    }).catch((error) => {
        console.error('Erro ao carregar produtos:', error);
        productListDiv.innerHTML = '<p>Erro ao carregar produtos.</p>';
    });
}

// Função para exibir detalhes dos blocos de cada produto
function viewProductBlocks(productId, userId) {
    const blocksDiv = document.getElementById(`blocks-${productId}`);
    if (blocksDiv.style.display === 'none') {
        loadProductBlocks(productId, userId, blocksDiv);
        blocksDiv.style.display = 'block';
    } else {
        blocksDiv.style.display = 'none';
    }
}
// Tornando a função acessível globalmente
window.viewProductBlocks = viewProductBlocks;

// Função para carregar os blocos de um produto específico
function loadProductBlocks(productId, userId, blocksDiv) {
    const productRef = db.ref(`users/${userId}/products/${productId}`);
    
    productRef.once('value', (snapshot) => {
        const product = snapshot.val();
        const agrotoxicoUsed = product.agrotoxicoUsed || 'Não especificado';
        const blocks = product.blocks;

        blocksDiv.innerHTML = '';

        if (blocks) {
            Object.keys(blocks).forEach(blockId => {
                const block = blocks[blockId];
                const blockDetailsDiv = document.createElement('div');
                blockDetailsDiv.innerHTML = `
                    <div class="blocos">
                    <h4>Informação: ${blockId}</h4>
                    <p>Nome do Agrotóxico: ${agrotoxicoUsed}</p>
                    <p>Quantidade de Agrotóxico: ${block.quantity} MG</p>
                    <p>Data de Uso: ${block.date}</p>
                    <p>Descrição do Bloco: ${block.description}</p>
                    </div>
                `;
                blocksDiv.appendChild(blockDetailsDiv);
            });
        } else {
            blocksDiv.innerHTML = '<p>Nenhum bloco encontrado.</p>';
        }
    }).catch(error => {
        console.error('Erro ao carregar blocos:', error);
        blocksDiv.innerHTML = '<p>Erro ao carregar blocos.</p>';
    });
}

// Função para filtrar produtos
function filterProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredProducts = allProducts.filter(product => product.name.toLowerCase().includes(searchTerm));
    displayProducts(filteredProducts);
    setupPagination(filteredProducts);
}

// Função para exibir produtos
function displayProducts(products) {
    const productListDiv = document.getElementById('product-list');
    productListDiv.innerHTML = '';

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);

    paginatedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <h3>${product.name}</h3>
            <p>Descrição: ${product.lastBlockDescription}</p>
            <p>CEP: ${product.cep}</p>
            <button class="view-button" onclick="viewProductBlocks('${product.productId}', '${product.userId}')">Ver Blocos</button>
            <div id="blocks-${product.productId}" class="block-list" style="display: none;"></div>
        `;
        productListDiv.appendChild(productCard);
    });
}

// Função para configurar a paginação
function setupPagination(products) {
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';

    const totalPages = Math.ceil(products.length / productsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.onclick = () => {
            currentPage = i;
            displayProducts(products);
            setupPagination(products);
        };
        paginationDiv.appendChild(pageButton);
    }
}

// Carrega todos os produtos ao iniciar
loadAllProducts();

// Torna a função de filtro global, caso seja necessária para o evento `keyup` do campo de busca
window.filterProducts = filterProducts;

export { filterProducts, viewProductBlocks };
