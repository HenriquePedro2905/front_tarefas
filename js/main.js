let id;

document.addEventListener('DOMContentLoaded', () => {
    const formNewTask = document.getElementById('formNewTask');

    formNewTask.addEventListener('submit', (event) => {
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
                formNewTask.reset();
                formNewTask.style.display = 'none';
            } else {
                console.error('error')
            }
        });
    });
});

function listAll(){
    let status;
    let taskCompleted;
    fetch('http://localhost:8080/task/listAll')
        .then(response => response.json())
        .then(data => {
            taskDiv.innerHTML = '';
            taskDiv.style.display = 'block';
            data.forEach(task => {
                if (task.status) {  
                    status = 'Concluida';
                    camp.checked = true;
                } else {
                    status = 'Pendente';
                }

                id = task.id;

                const taskElement = document.createElement('div');
                taskElement.textContent = `${task.name} - descrição: ${task.description} - Data: ${task.dateConlusion}
                                         - Status: ${status} - Prioridade: ${task.priority}`;

                taskCompleted = document.createElement('input');
                taskCompleted.type = 'checkbox';
                taskCompleted.id = `taskCompleted${id}`
                taskElement.appendChild(taskCompleted);
                taskDiv.appendChild(taskElement);
            });
            taskDiv.addEventListener('change', taskCompletedUpdate)
        });
    }

function taskCompletedUpdate(event){
    const clickCheckbox = event.target;
    const status = clickCheckbox.checked;
    const taskId = clickCheckbox.id.split('-')[1];

    const checkedStatusData = {
        id: taskId,
        status: status
    };

fetch('http://localhost:8080/task//updateStatus', {
    method: 'POST',
    headers:{
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(checkedStatusData)
}).then(response => {
    if(response.status === 201) {
        listAll();
    } else {
        console.error('error')
    }
  });
}