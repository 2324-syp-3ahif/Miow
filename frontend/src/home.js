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
    try {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('themeNR');
        localStorage.removeItem('trackPeriod');
        window.location.href = '/';
    }
    catch (error) {
        console.error('An error occurred during logout:', error);
        alert('An error occurred during logout. Please try again.');
    }
}
function loadSettings() {
    const track = document.getElementById('trackPeriod');
    const currentTrack = localStorage.getItem('trackPeriod');
    if (currentTrack) {
        track.checked = true;
    }
    else {
        track.checked = false;
    }
}
function deleteAccount() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = localStorage.getItem('token');
        try {
            const response = yield fetch("//localhost:3000/auth/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            logout();
        }
        catch (error) {
            console.error("Error submitting week data:", error);
        }
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
//# sourceMappingURL=home.js.map