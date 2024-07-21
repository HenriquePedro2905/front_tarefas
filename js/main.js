let currentTaskId;
const taskDiv = document.getElementById('taskDiv');

document.getElementById('newTaskButton').addEventListener('click', function() {
    let form = document.getElementById('formNewTask');

    if(form.style.display === 'none'){
        form.style.display = 'block';
        taskDiv.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const formNewTask = document.getElementById('formNewTask');

    formNewTask.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const dateInput = document.getElementById('dateConlusion').value;
        const priority = document.getElementById('priority').value;
        const status = false;

        const dateConlusion = new Date(dateInput).toISOString().split('T')[0];

        const taskData = {
            name: name,
            description: description,
            dateConclusion: dateConlusion,
            status: status,
            priority: priority
        };


        if(currentTaskId){
            taskData.id = currentTaskId;

            fetch('http://localhost:8080/task/update', {
                method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            }).then(response => {
                if(response.status === 200)   {
                    console.log('sucess')
                    formNewTask.style.display = 'none';
                } else {
                    console.error('error')
                }
            });
        } else{
            fetch('http://localhost:8080/task', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            }).then(response => {
                if(response.status === 201) {
                    console.log('sucess')
                    formNewTask.reset();
                    formNewTask.style.display = 'none';
                    currentTaskId = null;
                } else {
                    console.error('error')
                }
            });
        }
        
    });
});

async function list(list){

    let form = document.getElementById('formNewTask');

    if (form.style.display == 'block') {
        form.style.display = 'none';
    }

    let rota;

    if(list === 0){
        rota = 'listAll';
    } else if (list === 1){
        rota = 'listarByPriority';
    } else {
        rota = 'listByCompleted';
    }
    
    try {
        console.log(rota)

        let taskCompleted;
        let buttonDeletar;
        let buttonUpdate
        const response = await fetch(`http://localhost:8080/task/${rota}`);
        const data = await response.json();
        
        console.log('Dados recebidos:', data);
            
        taskDiv.innerHTML = '';
        taskDiv.style.display = 'block';
        
        data.forEach(task => {
                    let status = task.status ? 'Concluida' : 'Pendente';

                    const taskElement = document.createElement('div');
                    taskElement.className = 'taskElement';
                    taskElement.innerHTML = `
                        <p>${task.id}</p>
                        <span class="name-task">${task.name}</span><br>
                        <span class="description-task">descrição: ${task.description}</span><br>
                        <span class="date-task">Dia:${task.dateConclusion}</span><br>
                        <span class="status-task">${status}</span><br>
                        <span class="status-task">Prioridade: ${task.priority}</span><br>
                        <span class="nao-sei">Marcar como concluido</span> 
                        `;
                    
                   const taskId = task.id;
                   id = `taskElement-${task.id}`;
                        
                    buttonDeletar = document.createElement('button');
                    buttonUpdate = document.createElement('button');
                    
                    taskCompleted = document.createElement('input');
                    taskCompleted.type = 'checkbox';
                    taskCompleted.className = 'taskCompleted';
                    taskCompleted.id = `taskCompleted-${task.id}`;
                    taskCompleted.checked = task.status;
                    
                    buttonDeletar.textContent = 'Deletar'
                    buttonDeletar.addEventListener('click', function(){
                        deleteTask(0);
                    });

                    buttonUpdate.textContent = 'atualizar tarefa';
                    buttonUpdate.id = `taskID-${task.id}`;
                    buttonUpdate.addEventListener('click', () => updateTask(taskId));

                    taskElement.appendChild(taskCompleted);
                    taskElement.appendChild(buttonDeletar);
                    taskElement.appendChild(buttonUpdate)
                    taskDiv.appendChild(taskElement);
                });
        } catch (error){
            console.error('erro', error)
        }
            taskDiv.removeEventListener('change', taskCompletedUpdate)
            taskDiv.addEventListener('change', taskCompletedUpdate)
}


async function taskCompletedUpdate(event){
        console.log('teste')
        const clickCheckbox = event.target;
        const status = clickCheckbox.checked;
        const taskId = clickCheckbox.id.split('-')[1];


        const checkedStatusData = {
            id: taskId,
            status: status
        };

        try {
            const response = await fetch('http://localhost:8080/task/updateStatus', {
                method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(checkedStatusData)
            }).then(response => {
                if(response.status === 200) {
                        list(0);
                } else {
                    console.error('error')
                }
              });
        } catch (error) {
            console.error('error', error)
        }
}

async function deleteTask(deleteRota){
    
    const taskId = id?.split('-')[1];
    let rota = deleteRota === 0 ? 'delete' : 'deleteCompleted';

    const deleteData = {
        id: taskId,
        };

    try {
        const response = await fetch(`http://localhost:8080/task/${rota}`, {
            method: 'DELETE',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deleteData)
        }).then(response => {
            if(response.status === 200) {
                    list(0);
            } else {
                console.error('error')
            }
          });
    } catch (error) {
        console.error('error', error)
    }
}

async function updateTask(taskId){
    console.log(taskId)
    currentTaskId = taskId

    const tituloForm = document.getElementById('tituloForm');
    const updateTask = document.getElementById('formNewTask');

    tituloForm.innerHTML = 'atualizar tarefa';

    if(updateTask.style.display === 'none'){
        updateTask.style.display = 'block';
        taskDiv.style.display = 'none';
    }

    const taskData = await fetch(`http://localhost:8080/task/${taskId}`).then(res => res.json());
    document.getElementById('name').value = taskData.name;
    document.getElementById('description').value = taskData.description;
    document.getElementById('dateConlusion').value = taskData.dateConclusion;   
    document.getElementById('priority').value = taskData.priority;
}