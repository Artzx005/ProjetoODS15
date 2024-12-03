// auth-check.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import firebaseConfig from './config/FireBase/CONFIG.js';

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Função para verificar o estado de autenticação do usuário
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Usuário está autenticado, você pode acessar os dados do usuário com 'user'
        console.log('Usuário autenticado:', user);
    } else {
        // Usuário não está autenticado, redirecione para a página de login
        window.location.href = 'login.html';
    }
});
