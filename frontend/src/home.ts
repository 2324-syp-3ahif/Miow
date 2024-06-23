function logout(){
            try {
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                localStorage.removeItem('themeNR');
                localStorage.removeItem('trackPeriod');
                window.location.href = '/';
            } catch (error) {
                console.error('An error occurred during logout:', error);
                alert('An error occurred during logout. Please try again.');
            }
}



function loadSettings(){
    const track = document.getElementById('trackPeriod') as HTMLInputElement;
    const currentTrack = localStorage.getItem('trackPeriod');
    if (currentTrack) {
        track.checked = true;
    } else {
       track.checked = false;
    }
}











document.addEventListener('DOMContentLoaded', function() {
    const contents = Array.from(document.querySelectorAll('.content div')) as HTMLElement[];
    contents.forEach(content => {
        content.style.display = 'none';
    });


    const accountSettingsContent = document.getElementById('account-settings-content') as HTMLElement | null;
    if (accountSettingsContent) {
        accountSettingsContent.style.display = 'block';
    }

    const optButtons = Array.from(document.querySelectorAll('.opt-button')) as HTMLElement[];
    optButtons.forEach(button => {
        button.addEventListener('click', function() {
            contents.forEach(content => {
                content.style.display = 'none';
            });

            const buttonId = this.getAttribute('id');
            const content = document.getElementById(buttonId + '-content') as HTMLElement | null;
            if (content) {
                if (content.style.display === 'block') {
                    content.style.display = 'none';
                } else {
                    content.style.display = 'block';
                }
            }
        });
    });
});