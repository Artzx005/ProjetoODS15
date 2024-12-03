 // Importando Firebase
 import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
 import { getDatabase, ref, get, query, orderByChild } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

 import firebaseConfig from '../FireBase/CONFIG.js';

 const app = initializeApp(firebaseConfig);
 const db = getDatabase(app);

 const messageContainer = document.getElementById('messageContainer');
 const searchInput = document.getElementById('searchInput');
 const orderSelect = document.getElementById('orderSelect');

 function loadMessages() {
   const messagesRef = ref(db, 'Mensagens');
   const messagesQuery = query(messagesRef, orderByChild('ticketNumber'));
   
   get(messagesQuery).then((snapshot) => {
     let messages = [];
     snapshot.forEach((childSnapshot) => {
       messages.push(childSnapshot.val());
     });

     displayMessages(messages);
   }).catch((error) => {
     console.error("Erro ao carregar mensagens:", error);
   });
 }

 function displayMessages(messages) {
   messageContainer.innerHTML = '';
   const searchValue = searchInput.value.toLowerCase();
   const order = orderSelect.value;

   if (order === 'recent') {
     messages.sort((a, b) => b.ticketNumber - a.ticketNumber);
   } else {
     messages.sort((a, b) => a.ticketNumber - b.ticketNumber);
   }

   messages.forEach(function(message) {
     if (
       message.name.toLowerCase().includes(searchValue) ||
       message.email.toLowerCase().includes(searchValue)
     ) {
       const messageBlock = document.createElement('div');
       messageBlock.classList.add('message-block');
       messageBlock.innerHTML = `
         <h3>Ticket: ${message.ticketNumber}</h3>
         <p><strong>Nome:</strong> ${message.name}</p>
         <p><strong>Email:</strong> ${message.email}</p>
         <p><strong>Telefone:</strong> ${message.phone}</p>
         <p><strong>Mensagem:</strong> ${message.message}</p>
       `;
       messageContainer.appendChild(messageBlock);
     }
   });
 }

 searchInput.addEventListener('input', loadMessages);
 orderSelect.addEventListener('change', loadMessages);

 loadMessages(); // Carregar as mensagens inicialmente