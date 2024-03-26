async function login(): Promise<void> {
    const form = document.getElementById('login-form') as HTMLFormElement;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('username') as HTMLInputElement;
        const passwordInput = document.getElementById('password') as HTMLInputElement;
        const username = usernameInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                passwordIsWrong()
                throw new Error('Login failed');
            }

            const data = await response.json();
            const { token } = data;

            localStorage.setItem('token', token);


            window.location.href = '/home.html';
        } catch (error) {
            console.error('Login failed:', error);
        }
    });
}

function passwordIsWrong(): void {
    const errorElement = document.getElementById('error');
    errorElement.textContent = 'Password is wrong';
}

login();