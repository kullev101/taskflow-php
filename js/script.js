const taskForm = document.querySelector('.task-form');
const taskList = document.querySelector('.task-list');

function addTask(title) {
  const taskItem = document.createElement('li');
  taskItem.className = 'task';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';

  const taskTitle = document.createElement('h3');
  taskTitle.className = 'task-title';
  taskTitle.textContent = title;

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'task-delete';
  deleteButton.textContent = 'Delete';

  taskItem.append(checkbox, taskTitle, deleteButton);
  taskList.append(taskItem);
}

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const taskInput = document.querySelector('#task-title');
  const title = taskInput.value.trim();

  if (!title) {
    return;
  }

  addTask(title);
  taskInput.value = '';
});

// вешаю один обработчик на весь список, а не на каждую кнопку
taskList.addEventListener('click', (event) => {
  // проверяю, что кликнули именно по кнопке удаления
  const deleteButton = event.target.closest('.task-delete');

  if (!deleteButton) {
    return;
  }

  // нахожу задачу и удаляю её
  deleteButton.closest('.task').remove();
});
