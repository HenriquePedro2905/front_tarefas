document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('login-form');
    const formRegister = document.getElementById('registerForm');
    const apiUrl = "http://localhost:8080";

    formLogin.addEventListener('submit', async (event) => {
        event.preventDefault();

        const login = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await loginUser(login, password);
        } catch (error) {
            console.error('Erro no login:', error);
        }
    });

    async function loginUser(login, password) {
        const loginData = {
            login: login,
            password: password
        };
    
        try {
            const response = await fetch(`${apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });
    
            if (response.ok) {
                const data = await response.json();
    
                if (data.token) {
                    const token = data.token;
                    const userId = data.userId;
                    localStorage.setItem('userId', userId);
                    localStorage.setItem('authToken', token);
                    window.location.href = 'pages/taskManager.html';
                } else {
                    console.error('Token não encontrado');
                }
            } else {
                console.error('Erro na resposta da API:', response.status);
            }
        } catch (error) {
            console.error('Erro ao realizar login:', error);
        }
    }
    

    formRegister.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const login = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        const registerData = {
            name: name,
            login: login,
            password: password
        };

        try {
            const response = await fetch(`${apiUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerData)
            });

            if (response.status === 201) {
                alert('Conta criada');
                formRegister.reset();
                await loginUser(login, password);
            } else {
                console.error('Erro ao criar conta:', response.status);
            }
        } catch (error) {
            console.error('Erro ao criar conta:', error);
        }
    });
});