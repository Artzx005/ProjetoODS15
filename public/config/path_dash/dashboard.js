// Imports do Firebase Modular
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { getDatabase, ref, child, get } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';

// Importa o firebaseConfig
import firebaseConfig from '../FireBase/CONFIG.js';

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Checagem de autenticação
onAuthStateChanged(auth, (user) => {
    if (user) {
        const userId = user.uid;
        fetchProductData(userId);
    } else {
        alert("Você precisa estar logado para acessar os dados.");
        window.location.href = './login.html';
    }
});

function fetchProductData(userId) {
    const productsRef = ref(database, 'users/' + userId + '/products');
    get(productsRef).then((snapshot) => {
        if (snapshot.exists()) {
            const productsData = snapshot.val();
            processProductData(productsData);
        } else {
            alert("Nenhum produto encontrado.");
        }
    }).catch((error) => {
        console.error("Erro ao buscar produtos:", error);
    });
}

// Suponha que as demais funções estejam definidas no mesmo estilo (sem `firebase` global).

function processProductData(productsData) {
    const productNames = [];
    const agrotoxicoQuantities = [];

    for (const productId in productsData) {
        const product = productsData[productId];
        const totalAgrotoxico = product.blocks ? calculateTotalAgrotoxico(product.blocks) : 0;

        productNames.push(product.name);
        agrotoxicoQuantities.push(totalAgrotoxico);
    }

    generateCharts(productNames, agrotoxicoQuantities);
}

function calculateTotalAgrotoxico(blocks) {
    let total = 0;
    for (const blockId in blocks) {
        total += parseInt(blocks[blockId].quantity) || 0;
    }
    return total;
}

function generateCharts(productNames, agrotoxicoQuantities) {
    const ctxPie = document.getElementById('pieChart').getContext('2d');
    new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: productNames,
            datasets: [{
                label: 'Uso de Agrotóxicos (MG)',
                data: agrotoxicoQuantities,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF'
                ]
            }]
        }
    });

    const ctxBar = document.getElementById('barChart').getContext('2d');
    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: productNames,
            datasets: [{
                label: 'Quantidade de Agrotóxicos (MG)',
                data: agrotoxicoQuantities,
                backgroundColor: '#36A2EB'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

document.getElementById('exportBtn').addEventListener('click', () => {
    generatePDF();
});


async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Captura o conteúdo do relatório
    const reportContainer = document.getElementById('reportContainer');

    // Captura a imagem dos gráficos
    const canvasPie = document.getElementById('pieChart');
    const canvasBar = document.getElementById('barChart');
    
    const pieImage = await html2canvas(canvasPie);
    const barImage = await html2canvas(canvasBar);

    // Adiciona título ao PDF
    doc.setFontSize(20);
    doc.text('Relatório de Uso de Agrotóxicos', 20, 20);
    doc.setFontSize(12);
    const date = new Date();
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    doc.text(`Data do Relatório: ${formattedDate}`, 20, 30);

    // Adiciona informações adicionais
    const user = auth.currentUser;
    if (user) {
        doc.text(`Relatório da empresa: ${user.displayName || 'Nome Desconhecido'}`, 20, 40);
        doc.text(`Email: ${user.email}`, 20, 50);
        doc.text(`ID: ${user.uid}`, 20, 60);
    }

    // Adiciona gráficos ao PDF
    doc.addImage(pieImage.toDataURL(), 'PNG', 20, 70, 170, 90);
    doc.text('Distribuição de Uso de Agrotóxicos', 20, 165);
    doc.addImage(barImage.toDataURL(), 'PNG', 20, 180, 170, 90);
    doc.text('Comparação de Uso entre Produtos', 20, 275);

    // Salva o PDF
    doc.save('relatorio_agrotoxicos.pdf');
}