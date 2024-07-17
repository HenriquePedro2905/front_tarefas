document.getElementById('newTaskButton').addEventListener('click', function() {
    let form = document.getElementById('formNewTask');

    if(form.style.display === 'none'){
        form.style.display = 'block';
    }
});