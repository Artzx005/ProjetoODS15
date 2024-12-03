const themeToggleButton = document.getElementById('theme-toggle');
const bodyElement = document.body;

themeToggleButton.addEventListener('click', () => {
    bodyElement.classList.toggle('dark');

    // Alterna ícone entre sol (claro) e lua (escuro)
    const icon = themeToggleButton.querySelector('i');
    if (bodyElement.classList.contains('dark')) {
        icon.classList.replace('bx-moon', 'bx-sun');
    } else {
        icon.classList.replace('bx-sun', 'bx-moon');
    }
});
