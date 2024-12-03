// firebase-config.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';

// Configurações do Firebase


// Firebase configuração para acesso a api de banco
const firebaseConfig = {
    apiKey: "APIKEY",
    authDomain: "AUTHDOMAIN",
    databaseURL: "DATABASEURL",
    projectId: "ID",
    storageBucket: "BUCKET",
    messagingSenderId: "SENDERID",
    appId: "APPID",
    measurementId: "MEASUREMENTID"
  };
  
// Exportanto configurações padrão do firebase para posiveis mudanças futuras (se precisar)
export default firebaseConfig;
  

// Inicializa o Firebase para conectar front com back e banco
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth, ref, set };
