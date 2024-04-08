"use strict";
document.addEventListener('DOMContentLoaded', (event) => {
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        console.log('Adding event listener to logout button');
        logoutButton.addEventListener('click', () => {
            console.log('Logout button clicked');
            try {
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                window.location.href = '/';
            }
            catch (error) {
                console.error('An error occurred during logout:', error);
                alert('An error occurred during logout. Please try again.');
            }
        });
    }
    else {
        console.error('Logout button not found');
    }
});
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
};
//# sourceMappingURL=home.js.map