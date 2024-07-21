let currentTaskId;  // Variável global para armazenar o ID da tarefa atual (usada para atualização)
const taskDiv = document.getElementById('taskDiv');  // Elemento div que contém as tarefas listadas

// Evento para mostrar o formulário para criar uma nova tarefa ao clicar no botão "newTaskButton"
document.getElementById('newTaskButton').addEventListener('click', function() {  
    let form = document.getElementById('formNewTask');

    // Alterna a visibilidade do formulário de tarefa e esconde a lista de tarefas
    if(form.style.display === 'none'){   
        form.style.display = 'block';
        taskDiv.style.display = 'none';
    }
});

// Evento para envio do formulário ao carregar o documento
document.addEventListener('DOMContentLoaded', () => {  
    const formTask = document.getElementById('formNewTask');

    formTask.addEventListener('submit', (event) => {
        event.preventDefault();  // Previne o comportamento padrão de envio do formulário

        // Obtém os valores do formulário
        const name = document.getElementById('name').value; 
        const description = document.getElementById('description').value;
        const dateInput = document.getElementById('dateConlusion').value;           
        const priority = document.getElementById('priority').value;
        const status = false;  // Define o status da tarefa como pendente

        // Transforma a data em um formato aceito pelo back-end
        const dateConlusion = new Date(dateInput).toISOString().split('T')[0]; 

        // Cria um objeto com os dados da tarefa para enviar como JSON
        const taskData = {  
            name: name,
            description: description,
            dateConclusion: dateConlusion,
            status: status,
            priority: priority
        };

        // Verifica se existe um ID de tarefa atual
        if(currentTaskId){    
            taskData.id = currentTaskId;  // Define o ID do objeto com o ID atual

            // Envia uma requisição PUT para atualizar a tarefa
            fetch('http://localhost:8080/task/update', {    
                method: 'PUT',                              
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)  // Escreve o corpo da requisição com os dados para atualizar a tarefa
            }).then(response => {
                if(response.status === 200) {  // Verifica se a resposta foi bem-sucedida
                    alert('tarefa atualizada com sucesso');  // Exibe um alerta e reseta o formulário
                    formTask.style.display = 'none';
                    formTask.reset();
                } else {
                    console.error('error')
                }
            });
        } else {                                               
            // Envia uma requisição POST para criar uma nova tarefa
            fetch('http://localhost:8080/task', {            
                method: 'POST',                             
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)  // Escreve o corpo da requisição com os dados para criar uma nova tarefa
            }).then(response => {
                if(response.status === 201) {  // Verifica se a resposta foi bem-sucedida
                    formTask.reset();
                    formTask.style.display = 'none';
                    currentTaskId = null;
                    alert('tarefa criada com sucesso');  // Exibe um alerta e reseta o formulário
                } else {
                    console.error('error')
                }
            });
        }
    });
});

// Função para listar as tarefas
async function list(list){          
    let form = document.getElementById('formNewTask');

    // Verifica se o formulário está visível e o esconde
    if (form.style.display == 'block') {        
        form.style.display = 'none';
    }

    let rota;  

    // Define o endpoint dependendo do botão que foi apertado no HTML
    if(list === 0){     
        rota = 'listAll'; 
    } else if (list === 1){
        rota = 'listarByPriority';
    } else {
        rota = 'listByCompleted';
    }
    
    try {
        let taskCompleted;
        let buttonDeletar;
        let buttonUpdate;
        const response = await fetch(`http://localhost:8080/task/${rota}`);
        const data = await response.json();  // Obtém os dados recebidos na requisição
        
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
        const response = await fetch('http://localhost:8080/task/updateStatus', {   
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json'
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
    let rota = deleteRota === 0 ? 'delete' : 'deleteCompleted';

    // Cria um objeto com os dados para passar como JSON
    const deleteData = {
        id: taskId,
    };

    try {
        // Envia uma requisição DELETE para deletar a tarefa
        const response = await fetch(`http://localhost:8080/task/${rota}`, {
            method: 'DELETE',
            headers:{
                'Content-Type': 'application/json'
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

    const tituloForm = document.getElementById('tituloForm');
    const updateTask = document.getElementById('formNewTask');

    tituloForm.innerHTML = 'atualizar tarefa';  // Atualiza o título do formulário

    // Verifica se o formulário está visível e o exibe
    if(updateTask.style.display === 'none'){
        updateTask.style.display = 'block';
        taskDiv.style.display = 'none';
    }

    // Obtém os dados da tarefa a partir do ID
    const taskData = await fetch(`http://localhost:8080/task/${taskId}`).then(res => res.json());
    document.getElementById('name').value = taskData.name;
    document.getElementById('description').value = taskData.description;
    document.getElementById('dateConlusion').value = taskData.dateConclusion;   
    document.getElementById('priority').value = taskData.priority;
}
