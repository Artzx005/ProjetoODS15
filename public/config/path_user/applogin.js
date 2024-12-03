import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import firebaseConfig from '../FireBase/CONFIG.js';

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Função para verificar o estado da autenticação
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Se o usuário estiver autenticado, redireciona para o dashboard
        window.location.href = 'dashboard.html';
    }
});

// Manipular o formulário de login
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('Login bem-sucedido', userCredential.user);
            // Redirecionar para o dashboard após login bem-sucedido
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            console.error('Erro ao fazer login:', error.message);
            alert('Erro ao fazer login: ' + error.message);
        });
});

// Manipular o link para a página de cadastro
document.getElementById('register-link').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../cadastro.html';  // Abre a tela de cadastro
});
