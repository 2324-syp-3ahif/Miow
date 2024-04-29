async function login(): Promise<void> {
    const form = document.getElementById('login-form') as HTMLFormElement;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('username') as HTMLInputElement;
        const passwordInput = document.getElementById('password') as HTMLInputElement;
        const username = usernameInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                if (response.status === 404) {
                    passwordIsWrong("User does not exist")
                    return;
                }
                if (response.status === 401) {
                    passwordIsWrong("Password is wrong")
                    return;
                }
                throw new Error('Login failed');

            }else {
                const data = await response.json();
                console.log(data);

                if (data && data.accessToken) {
                    const token = data.accessToken;
                    localStorage.setItem('token', token);
                    localStorage.setItem('username', username);
                    window.location.href = '/home.html';

                } else {
                    console.error('Token not found in response');
                }
            }

        } catch (error) {
            console.error('Login failed:', error);
        }
    });
}

function passwordIsWrong(message : string): void {
    const errorElement = document.getElementById('error');
    errorElement.textContent = message;
}

window.onload = function() {
    login();
}