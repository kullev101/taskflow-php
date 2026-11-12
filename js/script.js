const taskForm = document.querySelector('.task-form');
const taskList = document.querySelector('.task-list');
const totalTasks = document.querySelector('#total-tasks');
const completedTasks = document.querySelector('#completed-tasks');
const remainingTasks = document.querySelector('#remaining-tasks');

// тут будут задачи, которые загрузим из localStorage
let tasks = [];

// id начинаю с нуля
let nextId = 0;

////////////////////////

// пересчитываю статистику для сайдбара
function updateStats() {
  const completed = tasks.filter((task) => task.completed).length;

  totalTasks.textContent = String(tasks.length).padStart(2, '0');
  completedTasks.textContent = String(completed).padStart(2, '0');
  remainingTasks.textContent = String(tasks.length - completed).padStart(2, '0');
}

////////////////////////

// JSON.stringify превращает массив в json строку
// потом такую строку можно сохранить или отправить на сервер
// а JSON.parse делает наоборот — из строки обратно в массив
function tasksToJson() {
  return JSON.stringify(tasks);
}

////////////////////////

// беру json строку и сохраняю её в localStorage под ключом tasks
function saveTasks() {
  const tasksJson = tasksToJson();
  localStorage.setItem('tasks', tasksJson);
}

////////////////////////

// достаю сохранённые задачи из localStorage
function loadTasks() {
  const tasksJson = localStorage.getItem('tasks');

  // если сохранений нет, оставляю пустой массив
  if (!tasksJson) {
    return;
  }

  // JSON.parse превращает строку обратно в массив
  tasks = JSON.parse(tasksJson);

  // беру следующий id после самого большого, чтобы не было повторов
  if (tasks.length > 0) {
    nextId = Math.max(...tasks.map((task) => task.id)) + 1;
  }
}

////////////////////////

// заново собираю весь список задач из массива
function renderTasks() {
  // очищаю список перед отрисовкой
  taskList.innerHTML = '';

  tasks.forEach((task) => {
    const taskItem = document.createElement('li');
    taskItem.className = 'task';
    taskItem.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;

    const taskTitle = document.createElement('h3');
    taskTitle.className = 'task-title';
    taskTitle.textContent = task.text;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'task-delete';
    deleteButton.textContent = 'Delete';

    taskItem.append(checkbox, taskTitle, deleteButton);
    taskList.append(taskItem);
  });

  updateStats();

  // показываю актуальный json в консоли
  console.log(tasksToJson());

  // сохраняю задачи в localStorage
  saveTasks();
}

////////////////////////

// добавляю новую задачу в массив
function addTask(title) {
  tasks.push({ id: nextId, text: title, completed: false });
  nextId += 1;

  renderTasks();
}

////////////////////////

// ловлю отправку формы
taskForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const taskInput = document.querySelector('#task-title');
  const title = taskInput.value.trim();

  if (!title) {
    return;
  }

  addTask(title);

  // очищаю поле после добавления
  taskInput.value = '';
});

////////////////////////

// вешаю один обработчик на весь список, а не на каждую кнопку
taskList.addEventListener('click', (event) => {
  // проверяю, что кликнули именно по кнопке удаления
  const deleteButton = event.target.closest('.task-delete');

  if (!deleteButton) {
    return;
  }

  // нахожу id задачи и убираю её из массива
  const taskItem = deleteButton.closest('.task');
  const id = Number(taskItem.dataset.id);
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return;
  }

  tasks.splice(index, 1);
  renderTasks();
});

////////////////////////

// отмечаю задачу выполненной прямо в массиве
taskList.addEventListener('change', (event) => {
  if (!event.target.classList.contains('task-checkbox')) {
    return;
  }

  const taskItem = event.target.closest('.task');
  const task = tasks.find((item) => item.id === Number(taskItem.dataset.id));

  if (!task) {
    return;
  }

  task.completed = event.target.checked;
  updateStats();

  // json тоже обновляю, чтобы он совпадал с массивом
  console.log(tasksToJson());

  // и сразу сохраняю новое состояние
  saveTasks();
});

////////////////////////

// сначала загружаю сохранённые задачи, потом рисую список
loadTasks();
renderTasks();
