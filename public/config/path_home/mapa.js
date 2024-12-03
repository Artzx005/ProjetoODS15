// Importando as funções necessárias do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import firebaseConfig from '../FireBase/CONFIG.js';

// Inicializando o aplicativo Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Inicializando o mapa
const map = L.map('map').setView([-14.235004, -51.92528], 5); // Centralizando no Brasil
// Adicionando a camada do OpenStreetMap ao mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Função para buscar coordenadas a partir de um endereço
async function getCoordinatesFromAddress(address) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1`);
    const data = await response.json();
    if (data.length > 0) {
        const location = data[0];
        return { lat: location.lat, lon: location.lon };
    } else {
        console.error(`Não foi possível encontrar coordenadas para o endereço: ${address}`);
        return null;
    }
}

// Função para buscar endereço a partir do CEP
async function getAddressFromCep(cep) {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    if (data && !data.erro) {
        const address = `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}`;
        return address;
    } else {
        console.error(`Não foi possível encontrar endereço para o CEP: ${cep}`);
        return null;
    }
}

// Função para adicionar um ponto no mapa
function addPoint(lat, lon, quantity) {
    const color = getColorBasedOnQuantity(quantity);
    L.circle([lat, lon], {
        color: color,
        radius: 500
    }).addTo(map);
}

// Função para determinar a cor do ponto com base na quantidade
function getColorBasedOnQuantity(quantity) {
    if (quantity >= 50) return 'red';
    if (quantity >= 30) return 'orange';
    return 'green';
}

// Função para carregar produtos do Firebase e adicionar ao mapa
async function loadProducts() {
    const usersSnapshot = await get(ref(database, 'users'));
    const users = usersSnapshot.val();

    for (let userId in users) {
        const userProducts = users[userId].products;
        if (userProducts) {
            for (let productId in userProducts) {
                const product = userProducts[productId];
                const cep = product.cep;
                const quantity = parseInt(product.blocks?.block_1?.quantity || 0);

                const address = await getAddressFromCep(cep);
                if (address) {
                    const coordinates = await getCoordinatesFromAddress(address);
                    if (coordinates) {
                        addPoint(coordinates.lat, coordinates.lon, quantity);
                    } else {
                        console.error(`Não foi possível adicionar ponto para o endereço: ${address}`);
                    }
                } else {
                    console.error(`Não foi possível obter o endereço para o CEP: ${cep}`);
                }
            }
        }
    }
}

// Carregar produtos ao iniciar
loadProducts();
