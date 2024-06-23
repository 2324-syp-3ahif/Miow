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



async function submitSettings() {
    console.log("UWU");
    const track = document.getElementById('trackPeriod');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const token = localStorage.getItem('token');
    const _newUsername = (usernameInput as HTMLInputElement).value;
    let trackvalue:boolean =false;
    if((track as HTMLInputElement).value=="on"){
        trackvalue=true;
    }
    if(((track as HTMLInputElement).checked && !localStorage.getItem('trackPeriod'))||!(track as HTMLInputElement).checked && localStorage.getItem('trackPeriod')){
        const requestbody={
            themeNR: localStorage.getItem('themeNR'),
            trackPeriod:trackvalue
        }
        try {
            const response = await fetch("http://localhost:3000/settings", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(requestbody)
            });
        } catch (error) {
            console.error("Error submitting week data:", error);
        }
    }

    if ((track as HTMLInputElement).checked) {
        localStorage.setItem('trackPeriod', 'true');
    } else {
        localStorage.removeItem('trackPeriod');
    }
    if (localStorage.getItem('username') !== (usernameInput as HTMLInputElement).value) {
        const requestbody={
            newUsername:_newUsername
        }
        try {
            const response = await fetch("http://localhost:3000/auth/change-username", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(requestbody)
            });
            logout()
        } catch (error) {
            console.error("Error submitting week data:", error);
        }
    }
}
    async function deleteAccount() {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch("//localhost:3000/auth/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            logout()
        } catch (error) {
            console.error("Error submitting week data:", error);
        }

    }


    document.addEventListener('DOMContentLoaded', function () {
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
            button.addEventListener('click', function () {
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
