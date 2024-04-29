async function register():Promise<void>{
    const form = document.getElementById('register-form') as HTMLFormElement;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('username') as HTMLInputElement;
        const passwordInput = document.getElementById('password') as HTMLInputElement;
        const username = usernameInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                if (response.status === 400) {
                    passwordIsWrong("Username already exists")
                    return;
                }
                throw new Error('Register failed');
            } else {
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
            console.error('Register failed:', error);
        }
    });
}