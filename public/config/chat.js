const responses = {
    1: "Caro agricultor, o uso de agrotóxicos é importante, mas o exagero pode trazer riscos sérios. O excesso pode afetar sua saúde e a de sua família, além de contaminar o solo e a água, prejudicando o meio ambiente. Também pode tornar as pragas mais resistentes, exigindo mais produtos químicos. E os resíduos nos alimentos podem afetar a saúde de quem os consome. Por isso, vamos buscar práticas mais sustentáveis que protejam a saúde de todos e garantam colheitas seguras!",
    2: "Você pode entrar em contato pelo telefone (11) 1234-5678 ou pelo e-mail contato@exemplo.com.",
    3: "Oferecemos serviços de consultoria, suporte técnico e desenvolvimento de software.",
    4: "O processo de atendimento inicia-se com uma avaliação das suas necessidades e seguimos com um plano personalizado."
    // Adicione mais respostas conforme necessário
};

document.getElementById("send-btn").addEventListener("click", () => {
    const select = document.getElementById("question-select");
    const selectedValue = select.value;

    if (selectedValue) {
        const userQuestion = select.options[select.selectedIndex].text; // Captura o texto da pergunta selecionada
        displayMessage(`Você escolheu: ${userQuestion}`, "user"); // Exibe a pergunta do usuário
        displayMessage(responses[selectedValue], "bot"); // Exibe apenas a resposta do bot
        select.value = ""; // Limpa a seleção após o envio
    } else {
        displayMessage("Por favor, selecione uma pergunta.", "bot");
    }
});

function displayMessage(message, sender) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");
    messageElement.classList.add(sender === "bot" ? "bot-message" : "user-message");
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Rolagem automática para a mensagem mais recente
}
