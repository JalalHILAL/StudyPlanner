
let currentDate = new Date();
let tasks = [
    {
        id: 1,
        title: "Mathematics Assignment",
        description: "Complete exercises 1-20 from Chapter 7",
        dueDate: new Date(),
        priority: "urgent",
        subject: "math",
        completed: false
    },
    {
        id: 2,
        title: "Physics Lab Report",
        description: "Write lab report for pendulum experiment",
        dueDate: new Date(Date.now() + 86400000),
        priority: "high",
        subject: "physics",
        completed: false
    },
    {
        id: 3,
        title: "History Essay",
        description: "Essay on Industrial Revolution",
        dueDate: new Date(Date.now() - 86400000),
        priority: "medium",
        subject: "history",
        completed: true
    }
];

let notes = [
    {
        id: 1,
        title: "Calculus - Derivatives",
        content: "The derivative of a function represents the rate of change...",
        subject: "math",
        createdAt: new Date(Date.now() - 86400000)
    },
    {
        id: 2,
        title: "Physics - Newton's Laws",
        content: "First Law: An object at rest stays at rest, and an object in motion...",
        subject: "physics",
        createdAt: new Date(Date.now() - 172800000)
    },
    {
        id: 3,
        title: "History - World War II",
        content: "Key events and timeline of WWII including major battles...",
        subject: "history",
        createdAt: new Date(Date.now() - 259200000)
    }
];

// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const taskModal = document.getElementById('taskModal');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskForm = document.getElementById('taskForm');
const cancelTaskBtn = document.getElementById('cancelTask');
const modalClose = document.querySelector('.modal-close');

// Navigation
navItems.forEach(item => {
    item.addEventListener('click', () => {
        const targetPage = item.getAttribute('data-page');
        
        // Update active nav item
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Show target page
        pages.forEach(page => page.classList.remove('active'));
        document.getElementById(targetPage).classList.add('active');
        
        // Load page-specific content
        if (targetPage === 'calendar') {
            generateCalendar();
        }
    });
});

// Task Management
addTaskBtn.addEventListener('click', () => {
    taskModal.classList.add('active');
});

cancelTaskBtn.addEventListener('click', closeTaskModal);
modalClose.addEventListener('click', closeTaskModal);

taskModal.addEventListener('click', (e) => {
    if (e.target === taskModal) {
        closeTaskModal();
    }
});

function closeTaskModal() {
    taskModal.classList.remove('active');
    taskForm.reset();
}

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(taskForm);
    const newTask = {
        id: Date.now(),
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        dueDate: new Date(document.getElementById('taskDueDate').value),
        priority: document.getElementById('taskPriority').value,
        subject: document.getElementById('taskSubject').value,
        completed: false
    };
    
    tasks.push(newTask);
    closeTaskModal();
    renderTasks();
    updateDashboard();
});

// Task Filters
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(f => f.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        renderTasks(filter);
    });
});

function renderTasks(filter = 'all') {
    const tasksContainer = document.querySelector('.tasks-container');
    let filteredTasks = tasks;
    
    switch (filter) {
        case 'pending':
            filteredTasks = tasks.filter(task => !task.completed);
            break;
        case 'completed':
            filteredTasks = tasks.filter(task => task.completed);
            break;
        case 'urgent':
            filteredTasks = tasks.filter(task => task.priority === 'urgent');
            break;
    }
    
    tasksContainer.innerHTML = filteredTasks.map(task => `
        <div class="task-card ${task.completed ? 'completed' : ''}">
            <div class="task-header">
                <input type="checkbox" class="task-checkbox-input" ${task.completed ? 'checked' : ''} 
                       onchange="toggleTask(${task.id})">
                <h3>${task.title}</h3>
                <span class="priority-badge ${task.priority}">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
            </div>
            <p class="task-description">${task.description}</p>
            <div class="task-footer">
                <span class="due-date">${task.completed ? 'Completed' : 'Due: ' + formatDate(task.dueDate)}</span>
                <span class="subject-tag ${task.subject}">${getSubjectName(task.subject)}</span>
            </div>
        </div>
    `).join('');
}

function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        updateDashboard();
    }
}

// Calendar functionality
function generateCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    const currentMonthElement = document.getElementById('currentMonth');
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    currentMonthElement.textContent = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric'
    }).format(currentDate);
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    let calendarHTML = '';
    
    // Previous month's trailing days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const day = prevMonth.getDate() - i;
        calendarHTML += `<div class="calendar-day other-month"><div class="day-number">${day}</div></div>`;
    }
    
    // Current month's days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = year === today.getFullYear() && 
                       month === today.getMonth() && 
                       day === today.getDate();
        
        calendarHTML += `
            <div class="calendar-day ${isToday ? 'today' : ''}">
                <div class="day-number">${day}</div>
            </div>
        `;
    }
    
    // Next month's leading days
    const remainingCells = 42 - (startingDayOfWeek + daysInMonth);
    for (let day = 1; day <= remainingCells; day++) {
        calendarHTML += `<div class="calendar-day other-month"><div class="day-number">${day}</div></div>`;
    }
    
    calendarDays.innerHTML = calendarHTML;
}

// Calendar navigation
document.getElementById('prevMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar();
});

// Utility functions
function formatDate(date) {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 1) return `in ${diffDays} days`;
    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
    
    return date.toLocaleDateString();
}

function getSubjectName(subject) {
    const subjects = {
        math: 'Mathematics',
        physics: 'Physics',
        history: 'History',
        other: 'Other'
    };
    return subjects[subject] || 'Other';
}

function updateDashboard() {
    const pendingTasks = tasks.filter(task => !task.completed);
    const todayTasks = tasks.filter(task => {
        const today = new Date();
        const taskDate = new Date(task.dueDate);
        return taskDate.toDateString() === today.toDateString() && !task.completed;
    });
    
    // Update stats
    document.querySelector('.stat-number').textContent = todayTasks.length;
    
    // Update upcoming tasks
    const upcomingTasksList = document.querySelector('.upcoming-tasks .task-list');
    upcomingTasksList.innerHTML = pendingTasks.slice(0, 3).map(task => `
        <div class="task-item ${task.priority === 'urgent' ? 'urgent' : ''}">
            <div class="task-checkbox"></div>
            <div class="task-content">
                <div class="task-title">${task.title}</div>
                <div class="task-meta">${formatDate(task.dueDate)}</div>
            </div>
        </div>
    `).join('');
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    generateCalendar();
    updateDashboard();
});

// Add Note functionality
document.getElementById('addNoteBtn').addEventListener('click', () => {
    // Simple prompt for demo - in a real app, you'd have a proper modal
    const title = prompt('Note title:');
    const content = prompt('Note content:');
    
    if (title && content) {
        const newNote = {
            id: Date.now(),
            title: title,
            content: content,
            subject: 'other',
            createdAt: new Date()
        };
        
        notes.unshift(newNote);
        renderNotes();
    }
});

function renderNotes() {
    const notesGrid = document.querySelector('.notes-grid');
    notesGrid.innerHTML = notes.map(note => `
        <div class="note-card">
            <h3>${note.title}</h3>
            <p class="note-preview">${note.content}</p>
            <div class="note-meta">
                <span class="note-date">${formatDate(note.createdAt)}</span>
                <span class="subject-tag ${note.subject}">${getSubjectName(note.subject)}</span>
            </div>
        </div>
    `).join('');
}

// Add Subject functionality
document.getElementById('addSubjectBtn').addEventListener('click', () => {
    alert('Add Subject functionality would open a modal to create a new subject.');
});

// Initialize notes
renderNotes();