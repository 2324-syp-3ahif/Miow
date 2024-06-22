function logout(){
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            console.log('Logout button clicked');
            try {
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                window.location.href = '/';
            } catch (error) {
                console.error('An error occurred during logout:', error);
                alert('An error occurred during logout. Please try again.');
            }
        });
    } else {
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
        })
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


async function fetchRestEndpoint
(route: string, method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", data?: object):
    Promise<any> {
    const options: RequestInit = { method };
    if (data) {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify(data);
    }
    const res = await fetch(route, options);
    if (!res.ok) {
        const error = new Error(`${method} ${res.url} ${res.status} (${res.statusText})`);
        throw error;
    }
    if (res.status !== 204) {
        return await res.json();
    }
}


