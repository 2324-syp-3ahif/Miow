"use strict";
document.addEventListener('DOMContentLoaded', (event) => {
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
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
    console.log('Username:', username);
    const nameElement = document.getElementById('username');
    nameElement.textContent = username;
}
async function getDate() {
    try {
        const dateElemt = document.getElementById("date");
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        dateElemt.textContent = `${day}/${month}/${year}`;
        console.log("date set");
    }
    catch (e) {
        console.log("error setting date", e);
    }
}
window.onload = function () {
    getName();
    getDate();
};
//# sourceMappingURL=home.js.map