"use strict";
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