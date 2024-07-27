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

document.getElementById('newTaskButton').addEventListener('click', function(){
    const formUpdateTask = document.getElementById('formUpdateTask');
    formUpdateTask.style.display = 'none';
    formNewTask.style.display = 'block';
})