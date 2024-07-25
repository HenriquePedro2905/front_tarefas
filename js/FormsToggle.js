document.addEventListener('DOMContentLoaded', function () {
    const signUpLink = document.getElementById('signUpLink');
    const loginLink = document.getElementById('loginLink');
    const loginContainer = document.getElementById('loginContainer');
    const registerContainer = document.getElementById('registerContainer');

    signUpLink.addEventListener('click', function (event) {
        event.preventDefault();
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'block';
    });

    loginLink.addEventListener('click', function (event) {
        event.preventDefault();
        registerContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    });
});


// Evento para mostrar o formulário para criar uma nova tarefa ao clicar no botão "newTaskButton"
document.getElementById('newTaskButton').addEventListener('click', function() {  
    let form = document.getElementById('formNewTask');
    const tituloForm = document.getElementById('tituloForm');
    const buttonSub = document.getElementById('button-submit');
    tituloForm.innerHTML = 'adicionar novas tarefas';  // Atualiza o título do formulário
    buttonSub.innerHTML = 'atualizar';
    form.reset();
    // Alterna a visibilidade do formulário de tarefa e esconde a lista de tarefas
    if(form.style.display === 'none'){   
        form.style.display = 'block';
        taskDiv.style.display = 'none';
    }
});