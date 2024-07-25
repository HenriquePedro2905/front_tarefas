document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('login-form');
    const formRegister = document.getElementById('registerForm');

    formLogin.addEventListener('submit', (event) => {
        event.preventDefault();

        const login = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        loginUser(login,password)

    });
      
        function loginUser(login, password){
            const loginData = {
                login: login,
                password: password
            };

            fetch('http://localhost:8080/auth/login',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            }).then(response => response.json())
            .then(data =>{
                if (data.token) {
                    const token = data.token;
                    const userId = data.userId;
                    localStorage.setItem('userId', userId)
                    localStorage.setItem('authToken', token);
                    window.location.href = 'pages/taskManager.html';
                } else {
                    console.error('Token nao encontrado');
                }
            });
        }


        formRegister.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const name = document.getElementById('name').value;
            const login = document.getElementById('registerEmail').value;
            const password = document.getElementById('password').value;
    
            const registerData = {
                name: name,
                login: login,
                password: password
            };
    
            fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerData)
            }).then(response => {
                if(response.status === 201){
                    alert('conta criada');
                    formRegister.reset();
                    console.log(response.status)
                    loginUser(login, password);
                }
            })
        })

});