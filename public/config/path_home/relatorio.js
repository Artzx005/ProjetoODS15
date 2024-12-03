// relatorio.js
import firebaseConfig from '../FireBase/CONFIG.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Inicializando o banco de dados

// Função para buscar todos os dados dos produtos no banco de dados Firebase
function fetchAllUserProducts() {
    return Promise.all([
        get(ref(database, '/users')), // Mudou de once() para get()
        get(ref(database, '/clients')) // Mudou de once() para get()
    ]).then(function(snapshots) {
        const usersSnapshot = snapshots[0].val();
        const clientsSnapshot = snapshots[1].val();
        const productsData = {};
        const userAgroToxicoUsage = {};

        for (const userId in usersSnapshot) {
            const user = usersSnapshot[userId];
            const companyName = clientsSnapshot[userId] ? clientsSnapshot[userId].companyName : "Empresa Desconhecida";

            userAgroToxicoUsage[companyName] = userAgroToxicoUsage[companyName] || 0;

            const userProducts = user.products;

            if (userProducts) {
                for (const productId in userProducts) {
                    const product = userProducts[productId];
                    let totalAgrotoxicos = 0;

                    // Verifica se o produto tem blocks (confirmando a segurança da informação)
                    if (product.blocks) {
                        for (const blockId in product.blocks) {
                            const block = product.blocks[blockId];
                            totalAgrotoxicos += parseInt(block.quantity) || 0;
                        }
                    }

                    // Adiciona o total de agrotóxicos por produto 
                    productsData[product.name] = (productsData[product.name] || 0) + totalAgrotoxicos;

                    // Soma o total de agrotóxicos por usuário/empresa
                    userAgroToxicoUsage[companyName] += totalAgrotoxicos;
                }
            }
        }

        // Remove empresas sem uso de agrotóxicos
        for (const company in userAgroToxicoUsage) {
            if (userAgroToxicoUsage[company] === 0) {
                delete userAgroToxicoUsage[company];
            }
        }

        return { productsData, userAgroToxicoUsage };
    });
}

// Função para gerar os gráficos
function generateCharts(productsData, userAgroToxicoUsage) {
    // Gráfico de Pizza para os produtos
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    const productNames = Object.keys(productsData);
    const productQuantities = Object.values(productsData);

    new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: productNames,
            datasets: [{
                data: productQuantities,
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40'],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${value} MG`;
                        }
                    }
                }
            }
        }
    });

    // Gráfico de Barras para o total de agrotóxicos por usuário
    const barCtx = document.getElementById('barChart').getContext('2d');
    const companyNames = Object.keys(userAgroToxicoUsage);
    const userQuantities = Object.values(userAgroToxicoUsage);

    new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: companyNames,
            datasets: [{
                label: 'Quantidade Total de Agrotóxicos (MG)',
                data: userQuantities,
                backgroundColor: '#36a2eb'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Quantidade (MG)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            return `${context.label}: ${context.raw} MG`;
                        }
                    }
                }
            }
        }
    });
}

// Carregar os dados e gerar os gráficos
fetchAllUserProducts().then(function({ productsData, userAgroToxicoUsage }) {
    generateCharts(productsData, userAgroToxicoUsage);
}).catch(function(error) {
    console.error("Erro ao carregar os dados: ", error);
});
