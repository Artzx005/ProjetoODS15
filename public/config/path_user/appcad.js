// Importa as funções necessárias do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';
import firebaseConfig from '../FireBase/CONFIG.js';

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Função de cadastro
document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const companyName = document.getElementById('company-name').value;
    const cnpj = document.getElementById('cnpj').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const termsAccepted = document.getElementById('terms-checkbox').checked;

    if (!termsAccepted) {
        alert('Você deve aceitar as regras e normas do site para se cadastrar.');
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const userId = userCredential.user.uid;

            // Salva os dados adicionais no Realtime Database
            set(ref(db, 'clients/' + userId), {
                companyName: companyName,
                cnpj: cnpj,
                email: email
            })
            .then(() => {
                console.log('Cliente cadastrado com sucesso!');

                // Após salvar os dados no Realtime Database, faça o login automático
                signInWithEmailAndPassword(auth, email, password)
                    .then(() => {
                        window.location.href = 'dashboard.html';  // Redireciona para o dashboard
                    })
                    .catch((error) => {
                        console.error('Erro ao fazer login após cadastro:', error.message);
                        alert('Erro ao fazer login após cadastro: ' + error.message);
                    });
            })
            .catch((error) => {
                console.error('Erro ao cadastrar cliente:', error.message);
                alert('Erro ao cadastrar cliente: ' + error.message);
            });
        })
        .catch((error) => {
            console.error('Erro ao criar usuário:', error.message);
            alert('Erro ao criar usuário: ' + error.message);
        });
});
