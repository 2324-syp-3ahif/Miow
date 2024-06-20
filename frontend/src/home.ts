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

function showNotebook(id : string){
    const notebooks = ['daily-notebook', 'weekly-notebook', 'monthly-notebook', "yearly-notebook", "predicting-notebook", "settings-notebook"];
    for (let notebook of notebooks){
        const element = document.getElementById(notebook);
        if(element){
            element.style.display = "none";
        }
        else{
            console.log("element not found");
        }
    }

    const notebookShow = document.getElementById(id);
    if(notebookShow){
        notebookShow.style.display = "block";
    }
    else{
        console.log("element not found");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const notebooks = ["#daily-notebook", "#weekly-notebook", "#monthly-notebook", "#predicting-notebook", "#settings-notebook"];

    const day =getDate();





    const hideAllNotebooks = () => {
        notebooks.forEach(notebook => {
            const element = document.querySelector(notebook) as HTMLElement;
            if (element) {
                element.style.display = 'none';
            }
        });
    }

    hideAllNotebooks();
    const dailyNotebook = document.querySelector("#daily-notebook") as HTMLElement;
    if (dailyNotebook) {
        dailyNotebook.style.display = 'block';
    }

    notebooks.forEach(notebook => {
        const tag = notebook.replace("-notebook", "-tag");
        const tagElement = document.querySelector(tag) as HTMLElement;
        if (tagElement) {
            tagElement.addEventListener('click', () => {
                hideAllNotebooks();
                const notebookElement = document.querySelector(notebook) as HTMLElement;
                if (notebookElement) {
                    notebookElement.style.display = 'block';
                }

                const activeElements = document.querySelectorAll(".tags img.active");
                activeElements.forEach(element => {
                    (element as HTMLElement).classList.remove("active");
                });

                tagElement.classList.add("active");
            });
        }
    });
});

$(document).ready(function() {
    const contents = document.querySelectorAll('.content div');
      contents.forEach(content => {
        (content as HTMLElement).style.display = 'none';
    });

    const accountSettingsContent = document.getElementById('account-settings-content');
    if (accountSettingsContent) {
        (accountSettingsContent as HTMLElement).style.display = 'block';
    }

    $('.opt-button').click(function() {

        contents.forEach(content => {
            (content as HTMLElement).style.display = 'none';
        });

        var buttonId = $(this).attr('id');
        const content = document.getElementById(buttonId + '-content');
        if (content) {
            if ((content as HTMLElement).style.display === 'block') {
                (content as HTMLElement).style.display = 'none';
            } else {
                (content as HTMLElement).style.display = 'block';

            }
        }
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


