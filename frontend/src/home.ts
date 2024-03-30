function logout() {
    const logoutButton = document.getElementById('logout');

    localStorage.removeItem('token');
    localStorage.removeItem('username');

    window.location.href = '/';

}

function getName() {
    const username = localStorage.getItem('username');

        if (username === null) {
                window.location.href = '/';
                return;
        }

    const nameElement = document.getElementById('username');
    nameElement.textContent = username;
}

window.onload = function () {
    getName();
}