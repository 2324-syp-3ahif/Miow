"use strict";
function logout() {
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
    }
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
function getDate() {
    try {
        const dateElemt = document.getElementById("date");
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        dateElemt.textContent = `${day}/${month}/${year}`;
        localStorage.setItem('date', `${day}/${month}/${year}`);
    }
    catch (e) {
        console.log("error setting date", e);
    }
}
function showNotebook(id) {
    const notebooks = ['daily-notebook', 'weekly-notebook', 'monthly-notebook', "yearly-notebook", "predicting-notebook", "settings-notebook"];
    for (let notebook of notebooks) {
        const element = document.getElementById(notebook);
        if (element) {
            element.style.display = "none";
        }
        else {
            console.log("element not found");
        }
    }
    const notebookShow = document.getElementById(id);
    if (notebookShow) {
        notebookShow.style.display = "block";
    }
    else {
        console.log("element not found");
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const notebooks = ["#daily-notebook", "#weekly-notebook", "#monthly-notebook", "#predicting-notebook", "#settings-notebook"];
    const hideAllNotebooks = () => {
        notebooks.forEach(notebook => {
            const element = document.querySelector(notebook);
            if (element) {
                element.style.display = 'none';
            }
        });
    };
    hideAllNotebooks();
    const dailyNotebook = document.querySelector("#daily-notebook");
    if (dailyNotebook) {
        dailyNotebook.style.display = 'block';
    }
    notebooks.forEach(notebook => {
        const tag = notebook.replace("-notebook", "-tag");
        const tagElement = document.querySelector(tag);
        if (tagElement) {
            tagElement.addEventListener('click', () => {
                hideAllNotebooks();
                const notebookElement = document.querySelector(notebook);
                if (notebookElement) {
                    notebookElement.style.display = 'block';
                }
                const activeElements = document.querySelectorAll(".tags img.active");
                activeElements.forEach(element => {
                    element.classList.remove("active");
                });
                tagElement.classList.add("active");
            });
        }
    });
});
$(document).ready(function () {
    const contents = document.querySelectorAll('.content div');
    contents.forEach(content => {
        content.style.display = 'none';
    });
    const accountSettingsContent = document.getElementById('account-settings-content');
    if (accountSettingsContent) {
        accountSettingsContent.style.display = 'block';
    }
    $('.opt-button').click(function () {
        contents.forEach(content => {
            content.style.display = 'none';
        });
        var buttonId = $(this).attr('id');
        const content = document.getElementById(buttonId + '-content');
        if (content) {
            if (content.style.display === 'block') {
                content.style.display = 'none';
            }
            else {
                content.style.display = 'block';
            }
        }
    });
});
window.onload = function () {
    getName();
    getDate();
};
//# sourceMappingURL=home.js.map