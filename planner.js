// Academic Planner: add, complete, delete, and filter tasks.
// Tasks persist in localStorage so they survive a page refresh.

document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('taskForm');
  const taskInput = document.getElementById('taskInput');
  const taskDueDate = document.getElementById('taskDueDate');
  const taskList = document.getElementById('taskList');
  const emptyState = document.getElementById('emptyState');
  const filterButtons = document.querySelectorAll('.filter-btn');

  if (!taskForm) return; // Only run on planner.html

  let tasks = loadTasks();
  let currentFilter = 'all';

  // ----- Storage -----
  function loadTasks() {
    const saved = localStorage.getItem('cos106_tasks');
    return saved ? JSON.parse(saved) : [];
  }

  function saveTasks() {
    localStorage.setItem('cos106_tasks', JSON.stringify(tasks));
  }

  // ----- Rendering -----
  function render() {
    taskList.innerHTML = '';

    const visibleTasks = tasks.filter(task => {
      if (currentFilter === 'pending') return !task.completed;
      if (currentFilter === 'completed') return task.completed;
      return true;
    });

    emptyState.style.display = visibleTasks.length === 0 ? 'block' : 'none';

    visibleTasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item' + (task.completed ? ' completed' : '');
      li.dataset.id = task.id;

      const dueText = task.dueDate ? ` (Due: ${task.dueDate})` : '';

      li.innerHTML = `
        <span class="task-text">${escapeHTML(task.text)}${dueText}</span>
        <span class="task-actions">
          <button class="toggle-btn">${task.completed ? 'Undo' : 'Complete'}</button>
          <button class="delete-btn">Delete</button>
        </span>
      `;

      taskList.appendChild(li);
    });
  }

  // Basic escaping so a task like "<script>" can't break the page
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ----- Task actions -----
  function addTask(text, dueDate) {
    tasks.push({
      id: Date.now().toString(),
      text: text.trim(),
      dueDate: dueDate || '',
      completed: false
    });
    saveTasks();
    render();
  }

  function toggleComplete(id) {
    tasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    render();
  }

  // ----- Event listeners -----
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (!text) return;

    addTask(text, taskDueDate.value);
    taskInput.value = '';
    taskDueDate.value = '';
    taskInput.focus();
  });

  taskList.addEventListener('click', (e) => {
    const li = e.target.closest('.task-item');
    if (!li) return;
    const id = li.dataset.id;

    if (e.target.classList.contains('toggle-btn')) {
      toggleComplete(id);
    } else if (e.target.classList.contains('delete-btn')) {
      deleteTask(id);
    }
  });

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  render();
});
