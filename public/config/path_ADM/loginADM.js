// Importa os módulos específicos do Firebase (versão modular v9+)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import firebaseConfig from '../FireBase/CONFIG.js';

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Função para realizar o login do admin
window.loginAdmin = function loginAdmin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Função de login com email e senha usando `signInWithEmailAndPassword`
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Redireciona para a página de dashboard do admin após o login
            window.location.href = "dashboard.html";
        })
        .catch((error) => {
            const errorMsg = error.message;
            errorMessage.textContent = `Erro: ${errorMsg}`;
        });
};
