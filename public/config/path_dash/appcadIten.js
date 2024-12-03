// Importa as variáveis de configuração do arquivo de configuração
import { db, auth, set, ref } from '../FireBase/CONFIG.js';

document.getElementById('product-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('product-name').value;
    const agrotoxicoUsed = document.getElementById('agrotoxico-used').value;
    const cep = document.getElementById('cep').value;
    const description = document.getElementById('product-description').value;
    const agreeTerms = document.getElementById('agree-terms').checked;

    if (!agreeTerms) {
        alert('Você deve concordar com as regras e normas do site para continuar.');
        return;
    }

    // Verifica se o usuário está autenticado
    const user = auth.currentUser;
    if (!user) {
        alert('Você precisa estar autenticado para cadastrar um produto.');
        return;
    }

    const userId = user.uid; // Obtendo o ID do usuário autenticado
    const newProductRef = ref(db, `users/${userId}/products/${Date.now()}`);

    set(newProductRef, {
        name: name,
        agrotoxicoUsed: agrotoxicoUsed,
        cep: cep,
        description: description
    })
    .then(() => {
        alert('Produto cadastrado com sucesso!');
        document.getElementById('product-form').reset();
    })
    .catch((error) => {
        console.error('Erro ao cadastrar produto:', error.message);
        alert('Erro ao cadastrar produto: ' + error.message);
    });
});
