document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#todo-form');
    const list = document.querySelector('#todo-list');
    const input = document.querySelector('#todo-input');

    async function fetchTasks(){
        const response = await fetch('/api/items');
        const data = await response.json();
        data.forEach(task => {
            addTaskToWebPage(task);
        });    
    }

    async function deleteTask(task){
        await fetch(`/api/items/${task.id}`, {
            method: 'DELETE'
        })
    }

    async function updateTask(task){
        await fetch(`/api/items/${task.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        })
    }

    async function addTask(task){
        console.log(JSON.stringify(task))
        await fetch(`/api/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        })
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = input.value;
        if (text){
            let task = {name: text, completed: false}
            await addTask({name: text, completed: false})
            addTaskToWebPage(task)
            input.value = '';
        }
    })

    function addTaskToWebPage(task){
        const li = document.createElement('li');
        li.textContent = task.name
        if (task.completed){
            li.style.textDecoration = 'line-through';
        }
        if (!task.completed){
            li.style.textDecoration = 'none';
        }
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', async () => {
            try{
                await deleteTask(task)
            }
            catch(err){
                console.error(err);
                return
            }
            li.remove();
        })

        const completedButton = document.createElement('button');
        completedButton.textContent = 'Completed';
        completedButton.addEventListener('click', async () => {
            if (task.completed){
                try{
                    await updateTask({'id': task.id, 'name': task.name, 'completed': false})
                }
                catch(err){
                    console.error(err);
                    return
                }
                li.style.textDecoration = 'none';
            }
            else{
                try{
                    await updateTask({'id': task.id, 'name': task.name, 'completed': true})
                }
                catch(err){
                    console.error(err);
                    return
                }
                li.style.textDecoration = 'line-through';
            }
        })

        li.appendChild(deleteButton);
        li.appendChild(completedButton);
        list.appendChild(li)  
    }

    fetchTasks();
})