let currentTaskId;  // Variável global para armazenar o ID da tarefa atual (usada para atualização)
const taskDiv = document.getElementById('taskDiv');  // Elemento div que contém as tarefas listadas
const token = localStorage.getItem('authToken');
const userId = localStorage.getItem('userId');
const apiUrl = "https://tarefas-9ku0.onrender.com";

localStorage.setItem('taskDiv', taskDiv);

// Evento para envio do formulário ao carregar o documento
document.addEventListener('DOMContentLoaded', () => {  
    const formNewTask = document.getElementById('formNewTask');
    const formUpdateTask = document.getElementById('formUpdateTask');


    formUpdateTask.addEventListener('submit', (event) => {
        event.preventDefault();  // Previne o comportamento padrão de envio do formulário

        
        // Obtém os valores do formulário
        const name = document.getElementById('nameUpdate').value; 
        const description = document.getElementById('descriptionUpdate').value;
        const dateInput = document.getElementById('dateConlusionUpdate').value;           
        const priority = document.getElementById('priorityUpdate').value;
        const status = false;  // Define o status da tarefa como pendente

        // Transforma a data em um formato aceito pelo back-end
        const dateConlusion = new Date(dateInput).toISOString().split('T')[0]; 

        // Cria um objeto com os dados da tarefa para enviar como JSON
        const taskData = {  
            id: currentTaskId,
            name: name,
            description: description,
            dateConclusion: dateConlusion,
            status: status,
            priority: priority
        };


            // Envia uma requisição PUT para atualizar a tarefa
            fetch(`${apiUrl}/task/update`, {    
                method: 'PUT',                              
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(taskData)  // Escreve o corpo da requisição com os dados para atualizar a tarefa
            }).then(response => {
                if(response.status === 200) {  // Verifica se a resposta foi bem-sucedida
                    alert('tarefa atualizada com sucesso');  // Exibe um alerta e reseta o formulário
                    formUpdateTask.style.display = 'none';
                    formUpdateTask.reset();
                } else {
                    console.error('error')
                }
            });
        });
        
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
    

            fetch(`${apiUrl}/task`, {            
                method: 'POST',                             
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(taskData)  // Escreve o corpo da requisição com os dados para criar uma nova tarefa
            }).then(response => {
                if(response.status === 201) {  // Verifica se a resposta foi bem-sucedida
                    formNewTask.reset();
                    formNewTask.style.display = 'none';
                    currentTaskId = null;
                    alert('tarefa criada com sucesso');  // Exibe um alerta e reseta o formulário
                } else {
                    console.error('error')
                }
            });
        });
});

// Função para listar as tarefas
async function list(list){          
    let form = document.getElementById('formNewTask');
    let formUp = document.getElementById('formUpdateTask');

    if (formUp.style.display == 'block') {        
        formUp.style.display = 'none';
    }

    // Verifica se o formulário está visível e o esconde
    if (form.style.display == 'block') {        
        form.style.display = 'none';
    }

    let rota;  

    // Define o endpoint dependendo do botão que foi apertado no HTML
    if(list === 0){     
        rota = `listAll/${userId}`; 
    } else if (list === 1){
        rota = `listarByPriority/${userId}`;
    } else {
        rota = `listByCompleted/${userId}`;
    }
    
    try {
        let taskCompleted;
        let buttonDeletar;
        let buttonUpdate;
                
        const response = await fetch(`${apiUrl}/task/${rota}`, {
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();  // Obtém os dados recebidos na requisição
        console.log(data)
        // Reseta o elemento taskDiv e define o display como block para mostrar as tarefas
        taskDiv.innerHTML = '';     
        taskDiv.style.display = 'block'; 
        
        // Percorre os dados recebidos na requisição
        data.forEach(task => {   
            // Define o status como concluído ou pendente: true = concluído, false = pendente
            let status = task.status ? 'Concluida' : 'Pendente'; 

            // Cria uma div para escrever as tarefas
            const taskElement = document.createElement('div');             
            taskElement.className = 'taskElement';  // Define a classe para estilizar no CSS
            taskElement.innerHTML = `                                     
                <span class="name-task">${task.name}</span><br>
                <span class="description-task">descrição: ${task.description}</span><br>
                <span class="date-task">Dia:${task.dateConclusion}</span><br>
                <span class="status-task">${status}</span><br>
                <span class="status-task">Prioridade: ${task.priority}</span><br>
                <span class="nao-sei">Marcar como concluido</span>`;  // Escreve a tarefa usando os dados recebidos na requisição
                    
            const taskId = task.id;  // Define o ID da tarefa
            id = `taskElement-${task.id}`;
                        
            // Cria um botão para deletar as tarefas
            buttonDeletar = document.createElement('button');                                
            // Cria um botão para atualizar as tarefas
            buttonUpdate = document.createElement('button');                                 

            // Cria uma checkbox para marcar a tarefa como concluída
            taskCompleted = document.createElement('input');                                
            taskCompleted.type = 'checkbox';
            taskCompleted.className = 'taskCompleted';  // Define a classe para estilizar
            taskCompleted.id = `taskCompleted-${task.id}`;  // Define o ID do checkbox
            taskCompleted.checked = task.status;  // Define o status do checkbox
                    
            buttonDeletar.textContent = 'Deletar';
            buttonDeletar.addEventListener('click', () => deleteTask(0));  // Cria um evento ao clicar no botão que chama a função de deletar

            buttonUpdate.textContent = 'atualizar tarefa';
            buttonUpdate.id = `taskID-${task.id}`;
            buttonUpdate.addEventListener('click', () => updateTask(taskId));  // Cria um evento ao clicar no botão que chama a função de atualizar

            // Adiciona os elementos à div da tarefa
            taskElement.appendChild(taskCompleted);
            taskElement.appendChild(buttonDeletar);
            taskElement.appendChild(buttonUpdate);
            taskDiv.appendChild(taskElement);
        });
    } catch (error){
        console.error('erro', error)
    }
    // Remove e adiciona o evento de mudança para a atualização do status da tarefa
    taskDiv.removeEventListener('change', taskCompletedUpdate);
    taskDiv.addEventListener('change', taskCompletedUpdate);
}

// Função para atualizar o status da tarefa
async function taskCompletedUpdate(event){            
    const clickCheckbox = event.target;  // Pega o evento de clicar no checkbox
    const status = clickCheckbox.checked;  // Define o status baseado no checkbox 
    const taskId = clickCheckbox.id.split('-')[1];  // Define o ID da tarefa a partir do checkbox

    // Cria um objeto com os dados para passar como JSON
    const checkedStatusData = {                     
        id: taskId,
        status: status
    };

    try {
        // Envia uma requisição PUT para atualizar o status da tarefa
        const response = await fetch(`${apiUrl}/task/updateStatus`, {   
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(checkedStatusData)  // Escreve o corpo da requisição com os dados para atualizar o status
        }).then(response => {
            if(response.status === 200) {  // Verifica se a resposta foi bem-sucedida
                list(0);  // Atualiza a lista de tarefas
            } else {
                console.error('error');
            }
        });
    } catch (error) {
        console.error('error', error);
    }
}

// Função para deletar a tarefa
async function deleteTask(deleteRota){
    const taskId = id?.split('-')[1];
    let rota = deleteRota === 0 ? `delete` : `deleteCompleted/${userId}`;

    // Cria um objeto com os dados para passar como JSON
    const deleteData = {
        id: taskId,
    };

    try {
        // Envia uma requisição DELETE para deletar a tarefa
        const response = await fetch(`${apiUrl}/task/${rota}`, {
            method: 'DELETE',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(deleteData)  // Escreve o corpo da requisição com os dados para deletar a tarefa
        }).then(response => {
            if(response.status === 200) {  // Verifica se a resposta foi bem-sucedida
                list(0);  // Atualiza a lista de tarefas
            } else {
                console.error('error');
            }
        });
    } catch (error) {
        console.error('error', error);
    }
}

// Função para atualizar a tarefa
async function updateTask(taskId){
    console.log(taskId);
    currentTaskId = taskId;

    const formNewTask = document.getElementById('formNewTask');
    const formUpdateTask = document.getElementById('formUpdateTask');

    taskDiv.style.display = 'none';
    formNewTask.style.display = 'none';
    formUpdateTask.style.display = 'block';

    // Obtém os dados da tarefa a partir do ID
    const taskData = await fetch(`${apiUrl}/task/${taskId}`,{
        headers:{
            'Authorization': `Bearer ${token}`
        }
    }).then(res => res.json());
    document.getElementById('nameUpdate').value = taskData.name;
    document.getElementById('descriptionUpdate').value = taskData.description;
    document.getElementById('dateConlusionUpdate').value = taskData.dateConclusion;   
    document.getElementById('priorityUpdate').value = taskData.priority;
}
