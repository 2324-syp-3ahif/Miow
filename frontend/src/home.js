"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    const token = localStorage.getItem('token');
    if (token === null) {
        window.location.href = '/';
        return;
    }
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    fetch('http://localhost:3000/entry/day', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ date: dateString })
    })
        .then(response => response.json())
        .then(data => {
        const dateElement = document.getElementById('date');
        dateElement.textContent = data.date;
    });
}
document.addEventListener('DOMContentLoaded', function () {
    const contents = Array.from(document.querySelectorAll('.content div'));
    contents.forEach(content => {
        content.style.display = 'none';
    });
    const accountSettingsContent = document.getElementById('account-settings-content');
    if (accountSettingsContent) {
        accountSettingsContent.style.display = 'block';
    }
    const optButtons = Array.from(document.querySelectorAll('.opt-button'));
    optButtons.forEach(button => {
        button.addEventListener('click', function () {
            contents.forEach(content => {
                content.style.display = 'none';
            });
            const buttonId = this.getAttribute('id');
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
});
function fetchRestEndpoint(route, method, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = { method };
        if (data) {
            options.headers = { "Content-Type": "application/json" };
            options.body = JSON.stringify(data);
        }
        const res = yield fetch(route, options);
        if (!res.ok) {
            const error = new Error(`${method} ${res.url} ${res.status} (${res.statusText})`);
            throw error;
        }
        if (res.status !== 204) {
            return yield res.json();
        }
    });
}
//# sourceMappingURL=home.js.map