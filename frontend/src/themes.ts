window.onload = () => {
    const themeButtons = document.querySelectorAll('#appearance-content button');
    themeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const imgElement = (event.target as Element).querySelector('img');
            const themeName = imgElement ? imgElement.alt : '';
            applyTheme(themeName);
        });
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }
};

function applyTheme(themeName: string) {
    document.body.className = '';
    document.body.classList.add(`theme-${themeName}`);
    localStorage.setItem('theme', themeName);
}