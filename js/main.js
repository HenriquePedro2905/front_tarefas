document.addEventListener('DOMContentLoaded', () => {
    const newTask = document.getElementById('newTask');

    newTask.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const dateConlusion = document.getElementById('dateConlusion').value;
        const priority = document.getElementById('priority').value;
        const status = false;

        const newTaskData = {
            name: name,
            description: description,
            dateConlusion: dateConlusion,
            status: status,
            priority: priority
        };


        fetch('http://localhost:8080/task', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTaskData)
        }).then(response => {
            if(response.status === 201) {
                console.log('sucess')
                newTask.reset();
            } else {
                console.error('errir')
            }
        });
    });
});