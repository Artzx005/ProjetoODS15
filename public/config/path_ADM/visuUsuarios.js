// Importar as funções necessárias do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getDatabase, ref, onValue, set, remove } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';
import firebaseConfig from '../FireBase/CONFIG.js'; // Ajuste o caminho conforme necessário

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); // Inicializando o banco de dados

// Função para carregar usuários da tabela 'clients'
function loadUsers() {
    const usersRef = ref(db, 'clients'); // Usar ref() para obter a referência
    onValue(usersRef, (snapshot) => { // Usar onValue para escutar as mudanças
        const usersData = snapshot.val();
        const userList = document.getElementById('user-list');
        userList.innerHTML = ''; // Limpar lista de usuários

        // Verificar se há usuários e iterar pelos dados
        if (usersData) {
            Object.keys(usersData).forEach(userId => {
                const user = usersData[userId];
                const userRow = `
                    <tr>
                        <td>${user.companyName || 'Não informado'}</td>
                        <td>${user.cnpj || 'Não informado'}</td>
                        <td>${user.email || 'Não informado'}</td>
                        <td>
                            <button class="action-button" onclick="deleteUser('${userId}')">Deletar</button>
                        </td>
                    </tr>`;
                userList.innerHTML += userRow;
            });
        } else {
            userList.innerHTML = '<tr><td colspan="4">Nenhum usuário encontrado</td></tr>';
        }
    });
}

// Função para adicionar um novo usuário
function addUser() {
    const username = document.getElementById('new-username').value;
    const cnpj = document.getElementById('new-cnpj').value;
    const email = document.getElementById('new-email').value;
    const password = document.getElementById('new-password').value;

    if (username && cnpj && email && password) {
        const newUserRef = ref(db, 'clients').push(); // Usar ref() para criar uma nova referência
        set(newUserRef, {
            companyName: username,
            cnpj: cnpj,
            email: email
        }).then(() => {
            alert('Usuário adicionado com sucesso!');
            document.getElementById('new-username').value = '';
            document.getElementById('new-cnpj').value = '';
            document.getElementById('new-email').value = '';
            document.getElementById('new-password').value = '';
            loadUsers(); // Recarregar a lista de usuários
        }).catch((error) => {
            alert('Erro ao adicionar usuário: ' + error.message);
        });
    } else {
        alert('Preencha todos os campos.');
    }
}

// Função para deletar um usuário
function deleteUser(userId) {
    const confirmDelete = confirm('Tem certeza que deseja deletar este usuário?');
    if (confirmDelete) {
        remove(ref(db, 'clients/' + userId)) // Usar remove() com ref()
            .then(() => {
                alert('Usuário deletado com sucesso!');
                loadUsers(); // Recarregar a lista após deletar
            }).catch((error) => {
                alert('Erro ao deletar usuário: ' + error.message);
            });
    }
}

// Carregar a lista de usuários ao iniciar
loadUsers();
