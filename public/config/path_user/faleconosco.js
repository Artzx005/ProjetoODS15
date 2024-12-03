import firebaseConfig from '../FireBase/CONFIG.js';

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);

        // Handle form submission
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;

            // Save to Firebase
            const ticketNumber = Date.now(); // Generate a unique ticket number
            firebase.database().ref('Mensagens/' + ticketNumber).set({
                name: name,
                email: email,
                phone: phone,
                message: message,
                ticketNumber: ticketNumber
            }).then(() => {
                alert('Sua mensagem foi enviada com sucesso!');
            }).catch((error) => {
                console.error("Erro ao enviar mensagem: ", error);
            });
        });