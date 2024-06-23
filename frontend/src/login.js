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
function login() {
    return __awaiter(this, void 0, void 0, function* () {
        const form = document.getElementById('login-form');
        form.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            const username = usernameInput.value;
            const password = passwordInput.value;
            try {
                const response = yield fetch('/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                if (!response.ok) {
                    if (response.status === 404) {
                        message("User does not exist");
                        return;
                    }
                    if (response.status === 401) {
                        message("Password is wrong");
                        return;
                    }
                    throw new Error('Login failed');
                }
                else {
                    const data = yield response.json();
                    console.log(data);
                    if (data && data.accessToken) {
                        const token = data.accessToken;
                        localStorage.setItem('token', token);
                        localStorage.setItem('username', username);
                        const response2 = yield fetch(`http://localhost:3000/settings`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        const responseData = yield response2.json();
                        localStorage.setItem('trackPeriod', responseData.u.trackPeriod);
                        localStorage.setItem('themeNR', responseData.u.themeNR);
                        window.location.href = `/home.html`;
                    }
                    else {
                        console.error('Token not found in response');
                    }
                }
            }
            catch (error) {
                console.error('Login failed:', error);
            }
        }));
    });
}
function message(message) {
    const errorElement = document.getElementById('error');
    errorElement.textContent = message;
}
window.onload = function () {
    login().then(r => console.log("logged in"));
};
//# sourceMappingURL=login.js.map