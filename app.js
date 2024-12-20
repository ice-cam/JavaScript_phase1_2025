$(document).ready(function() {
    // Task array to store all tasks
    let tasks = [];

    // Add task function
    function addTask(taskText) {
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        
        tasks.push(task);
        renderTask(task);
        saveToLocalStorage();
    }

    // Render single task
    function renderTask(task) {
        const taskElement = $(`
            <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <span class="task-content">${task.text}</span>
                <div class="task-actions">
                    <button class="edit-btn">Edit</button>
                    <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button class="delete-btn">Delete</button>
                </div>
            </li>
        `).hide().fadeIn(300);

        $('#taskList').append(taskElement);
    }

    // Save tasks to localStorage
    function saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Load tasks from localStorage
    function loadFromLocalStorage() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
            tasks.forEach(task => renderTask(task));
        }
    }

    // Add new task
    $('#addTask').click(function() {
        const taskText = $('#taskInput').val().trim();
        if (taskText) {
            addTask(taskText);
            $('#taskInput').val('');
        }
    });

    // Handle enter key
    $('#taskInput').keypress(function(e) {
        if (e.which === 13) {
            const taskText = $(this).val().trim();
            if (taskText) {
                addTask(taskText);
                $(this).val('');
            }
        }
    });

    // Handle task actions (Complete, Delete, Edit)
    $('#taskList').on('click', '.complete-btn', function() {
        const li = $(this).closest('li');
        const taskId = parseInt(li.data('id'));
        const task = tasks.find(t => t.id === taskId);
        
        if (task) {
            task.completed = !task.completed;
            li.toggleClass('completed');
            $(this).text(task.completed ? 'Undo' : 'Complete');
            saveToLocalStorage();
        }
    });

    $('#taskList').on('click', '.delete-btn', function() {
        const li = $(this).closest('li');
        const taskId = parseInt(li.data('id'));
        
        tasks = tasks.filter(t => t.id !== taskId);
        li.fadeOut(300, function() {
            $(this).remove();
        });
        saveToLocalStorage();
    });

    $('#taskList').on('click', '.edit-btn', function() {
        const li = $(this).closest('li');
        const taskContent = li.find('.task-content');
        const currentText = taskContent.text();
        
        const input = $('<input type="text">').val(currentText);
        taskContent.html(input);
        input.focus();

        input.blur(function() {
            const newText = $(this).val().trim();
            if (newText) {
                const taskId = parseInt(li.data('id'));
                const task = tasks.find(t => t.id === taskId);
                if (task) {
                    task.text = newText;
                    saveToLocalStorage();
                }
            }
            taskContent.text(newText || currentText);
        });

        input.keypress(function(e) {
            if (e.which === 13) {
                $(this).blur();
            }
        });
    });

    // Filter tasks
    $('#taskFilter').change(function() {
        const filter = $(this).val();
        
        $('.task-item').each(function() {
            const li = $(this);
            const taskId = parseInt(li.data('id'));
            const task = tasks.find(t => t.id === taskId);
            
            if (filter === 'all' || 
                (filter === 'completed' && task.completed) || 
                (filter === 'pending' && !task.completed)) {
                li.show();
            } else {
                li.hide();
            }
        });
    });

    // Load tasks on page load
    loadFromLocalStorage();
});