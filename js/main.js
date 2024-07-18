let id;
const taskDiv = document.getElementById('taskDiv');

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

        const newTaskData = {
            name: name,
            description: description,
            dateConclusion: dateConlusion,
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

async function listAll(){
    try {
        let status;
        let taskCompleted;
        const response = await fetch('http://localhost:8080/task/listAll');
        const data = await response.json();
        taskDiv.innerHTML = '';
        taskDiv.style.display = 'block';
                data.forEach(task => {

                    let status = task.status ? 'Concluida' : 'Pendente';

                    const taskElement = document.createElement('div');
                    taskElement.textContent = `${task.name} - descrição: ${task.description} - Data: ${task.dateConclusion}
                                            - Status: ${status} - Prioridade: ${task.priority}`;

                    taskCompleted = document.createElement('input');
                    taskCompleted.type = 'checkbox';
                    taskCompleted.id = `taskCompleted-${task.id}`;
                    taskCompleted.checked = task.status;
                    taskElement.appendChild(taskCompleted);
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
//          arrumar a data que nao esta chegadno correto
        try {
            const response = await fetch('http://localhost:8080/task/updateStatus', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(checkedStatusData)
            }).then(response => {
                if(response.status === 200) {
                    listAll();
                } else {
                    console.error('error')
                }
              });
        } catch (error) {
            console.error('error', error)
        }
    
    
}