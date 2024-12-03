import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.12.0/firebase-app.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/9.12.0/firebase-database.js';
import firebaseConfig from '../FireBase/CONFIG.js';

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function fetchUserData() {
    const usersRef = ref(db, "users");
    const snapshot = await get(usersRef);
    const users = snapshot.val();
    if (users) {
        displayProducts(users);
        generateAgrotoxicosChart(users);
        generateComparisonText(users);
    } else {
        console.log('No users found');
    }
}

function displayProducts(users) {
    const productList = document.getElementById('product-list');
    let html = '';
    Object.keys(users).forEach(userId => {
        const userProducts = users[userId].products || {};
        html += `<h3>Usuário ${userId}</h3><ul>`;
        Object.keys(userProducts).forEach(productId => {
            const product = userProducts[productId];
            html += `<li>Produto: ${product.name} <br> Agrotóxico: ${product.agrotoxicoUsed} <br> Quantidade: ${product.blocks.block_1?.quantity || 0}</li>`;
        });
        html += '</ul>';
    });
    productList.innerHTML = html;
}

function generateAgrotoxicosChart(users) {
    const userLabels = [];
    const agrotoxicoData = [];
    Object.keys(users).forEach(userId => {
        let totalAgrotoxicos = 0;
        const userProducts = users[userId].products || {};
        Object.keys(userProducts).forEach(productId => {
            totalAgrotoxicos += parseInt(userProducts[productId].blocks.block_1?.quantity || 0);
        });
        userLabels.push(`Usuário ${userId}`);
        agrotoxicoData.push(totalAgrotoxicos);
    });

    const ctx = document.getElementById('agrotoxicosChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: userLabels,
            datasets: [{
                label: 'Uso de Agrotóxicos',
                data: agrotoxicoData,
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0'],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Ajusta a proporção
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Distribuição de Uso de Agrotóxicos por Usuário'
                }
            }
        }
    });
}

function generateComparisonText(users) {
    const comparisonText = document.getElementById('comparison-text');
    let totalAgrotoxicos = {};
    Object.keys(users).forEach(userId => {
        totalAgrotoxicos[userId] = 0;
        const userProducts = users[userId].products || {};
        Object.keys(userProducts).forEach(productId => {
            totalAgrotoxicos[userId] += parseInt(userProducts[productId].blocks.block_1?.quantity || 0);
        });
    });

    const userIds = Object.keys(totalAgrotoxicos);
    let text = '';
    for (let i = 0; i < userIds.length - 1; i++) {
        const userA = userIds[i];
        const userB = userIds[i + 1];
        const diff = ((totalAgrotoxicos[userA] - totalAgrotoxicos[userB]) / totalAgrotoxicos[userB]) * 100;
        text += `Usuário ${userA} usou ${diff.toFixed(2)}% a mais de agrotóxicos que Usuário ${userB}.<br>`;
    }
    comparisonText.innerHTML = text;
}

window.onload = fetchUserData;