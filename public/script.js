 /* =========================
   SIGNUP
========================= */

async function signup() {

    const name = document.getElementById("name").value;

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    const role = document.getElementById("role").value;

    const response = await fetch("/signup", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            name,
            email,
            password,
            role
        })

    });

    const data = await response.json();

    alert(data.message);

    if (data.message === "Signup successful") {

        window.location.href = "index.html";

    }

}


/* =========================
   LOGIN
========================= */

async function login() {

    const email = document.getElementById("loginEmail").value;

    const password = document.getElementById("loginPassword").value;

    const response = await fetch("/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            password
        })

    });

    const data = await response.json();

    alert(data.message);

    if (data.message === "Login successful") {

        localStorage.setItem("name", data.name);

        localStorage.setItem("role", data.role);

        window.location.href = "dashboard.html";

    }

}


/* =========================
   DASHBOARD LOAD
========================= */

if (window.location.pathname.includes("dashboard.html")) {

    const name = localStorage.getItem("name");

    const role = localStorage.getItem("role");

    document.getElementById("welcomeText").innerText =
        `Welcome ${name} 👋`;

    document.getElementById("roleText").innerText =
        `Role: ${role}`;

    /* MEMBER CANNOT CREATE TASKS */

    if (role === "Member") {

        document.getElementById("taskTitle").style.display = "none";

        document.getElementById("taskDescription").style.display = "none";

        document.getElementById("assignedTo").style.display = "none";

        document.getElementById("dueDate").style.display = "none";

        document.querySelector(".task-section button").style.display = "none";

        document.getElementById("createTaskHeading").style.display = "none";

    }

    loadTasks();

    loadProjects();

}


/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.clear();

    window.location.href = "index.html";

}


/* =========================
   CREATE TASK
========================= */

async function createTask() {

    const title =
        document.getElementById("taskTitle").value;

    const description =
        document.getElementById("taskDescription").value;

    const assignedTo =
        document.getElementById("assignedTo").value;

    const dueDate =
        document.getElementById("dueDate").value;

    const response = await fetch("/create-task", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            title,
            description,
            assignedTo,
            dueDate
        })

    });

    const data = await response.json();

    alert(data.message);

    document.getElementById("taskTitle").value = "";

    document.getElementById("taskDescription").value = "";

    document.getElementById("assignedTo").value = "";

    document.getElementById("dueDate").value = "";

    loadTasks();

}


/* =========================
   LOAD TASKS
========================= */

async function loadTasks() {

    const response = await fetch("/tasks");

    const tasks = await response.json();

    const taskList =
        document.getElementById("taskList");

    taskList.innerHTML = "";

    /* DASHBOARD COUNTS */

    let total = tasks.length;

    let completed = tasks.filter(
        task => task.status === "Completed"
    ).length;

    let pending = tasks.filter(
        task => task.status !== "Completed"
    ).length;

    document.getElementById("totalTasks").innerText = total;

    document.getElementById("completedTasks").innerText = completed;

    document.getElementById("pendingTasks").innerText = pending;


    /* SEARCH + FILTER */

    const searchValue =
    document.getElementById("searchTask")
    ? document.getElementById("searchTask").value.toLowerCase()
    : "";

    const filterValue =
    document.getElementById("filterStatus")
    ? document.getElementById("filterStatus").value
    : "All";

    const filteredTasks = tasks.filter(task => {

        const matchesSearch =
        task.title.toLowerCase().includes(searchValue);

        const matchesFilter =
        filterValue === "All"
        || task.status === filterValue;

        return matchesSearch && matchesFilter;

    });


    /* SHOW TASKS */

    filteredTasks.forEach(task => {

        taskList.innerHTML += `

        <div class="task-card">

            <h3>${task.title}</h3>

            <p>${task.description}</p>

            <p><b>Assigned To:</b> ${task.assignedTo}</p>

            <p><b>Status:</b> ${task.status}</p>

            <p><b>Due Date:</b> ${task.dueDate}</p>

            <p class="${
                new Date(task.dueDate) < new Date()
                && task.status !== "Completed"
                ? 'overdue'
                : 'ontime'
            }">

            ${
                new Date(task.dueDate) < new Date()
                && task.status !== "Completed"
                ? 'Overdue Task'
                : 'On Track'
            }

            </p>

            <select onchange="updateTask(${task.id}, this.value)">

                <option value="Pending"
                ${task.status === "Pending" ? "selected" : ""}>
                Pending
                </option>

                <option value="In Progress"
                ${task.status === "In Progress" ? "selected" : ""}>
                In Progress
                </option>

                <option value="Completed"
                ${task.status === "Completed" ? "selected" : ""}>
                Completed
                </option>

            </select>

            <button onclick="deleteTask(${task.id})">
                Delete
            </button>

        </div>

        `;

    });

}


/* =========================
   UPDATE TASK
========================= */

async function updateTask(id, status) {

    const response = await fetch(`/update-task/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            status
        })

    });

    const data = await response.json();

    alert(data.message);

    loadTasks();

}


/* =========================
   DELETE TASK
========================= */

async function deleteTask(id) {

    const response = await fetch(`/delete-task/${id}`, {

        method: "DELETE"

    });

    const data = await response.json();

    alert(data.message);

    loadTasks();

}


/* =========================
   SIDEBAR FUNCTIONS
========================= */

function showDashboard() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

function showTasks() {

    document.querySelector(".task-section")
    .scrollIntoView({
        behavior: "smooth"
    });

}


/* =========================
   PROJECTS
========================= */

function createProject() {

    const projectName =
    document.getElementById("projectName").value;

    if(projectName === "") {

        alert("Enter project name");

        return;

    }

    let projects =
    JSON.parse(localStorage.getItem("projects")) || [];

    projects.push(projectName);

    localStorage.setItem(
        "projects",
        JSON.stringify(projects)
    );

    document.getElementById("projectName").value = "";

    loadProjects();

}


/* LOAD PROJECTS */

function loadProjects() {

    const projectList =
    document.getElementById("projectList");

    if(!projectList) return;

    projectList.innerHTML = "";

    let projects =
    JSON.parse(localStorage.getItem("projects")) || [];

    projects.forEach(project => {

        projectList.innerHTML += `

        <div class="task-card">

            <h3>${project}</h3>

        </div>

        `;

    });

}


/* SHOW PROJECT SECTION */

function showProjects() {

    document.querySelector(".project-section")
    .scrollIntoView({
        behavior:"smooth"
    });

}