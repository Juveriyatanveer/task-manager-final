 const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");

const app = express();

app.use(express.json());

app.use(express.static("public"));

/* =========================
   DATABASE CONNECTION
========================= */

const db = new sqlite3.Database("./database.sqlite", (err) => {

    if (err) {

        console.log(err.message);

    } else {

        console.log("SQLite Connected");

    }

});


/* =========================
   USERS TABLE
========================= */

db.run(`
CREATE TABLE IF NOT EXISTS users(

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT,

    email TEXT UNIQUE,

    password TEXT,

    role TEXT

)
`);


/* =========================
   TASKS TABLE
========================= */

db.run(`
CREATE TABLE IF NOT EXISTS tasks(

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    title TEXT,

    description TEXT,

    status TEXT,

    assignedTo TEXT,

    dueDate TEXT

)
`);


/* =========================
   SIGNUP API
========================= */

app.post("/signup", async (req, res) => {

    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(

        `INSERT INTO users(name,email,password,role)
         VALUES(?,?,?,?)`,

        [name, email, hashedPassword, role],

        function (err) {

            if (err) {

                return res.status(400).json({
                    message: "Email already exists"
                });

            }

            res.json({
                message: "Signup successful"
            });

        }

    );

});


/* =========================
   LOGIN API
========================= */

app.post("/login", (req, res) => {

    const { email, password } = req.body;

    db.get(

        `SELECT * FROM users WHERE email=?`,

        [email],

        async (err, user) => {

            if (err || !user) {

                return res.status(400).json({
                    message: "User not found"
                });

            }

            const validPassword = await bcrypt.compare(
                password,
                user.password
            );

            if (!validPassword) {

                return res.status(400).json({
                    message: "Invalid password"
                });

            }

            res.json({

                message: "Login successful",

                role: user.role,

                name: user.name

            });

        }

    );

});


/* =========================
   CREATE TASK API
========================= */

app.post("/create-task", (req, res) => {

    const {
        title,
        description,
        assignedTo,
        dueDate
    } = req.body;

    db.run(

        `INSERT INTO tasks(
            title,
            description,
            status,
            assignedTo,
            dueDate
        )
        VALUES(?,?,?,?,?)`,

        [
            title,
            description,
            "Pending",
            assignedTo,
            dueDate
        ],

        function (err) {

            if (err) {

                return res.status(400).json({
                    message: "Task creation failed"
                });

            }

            res.json({
                message: "Task created successfully"
            });

        }

    );

});


/* =========================
   GET ALL TASKS
========================= */

app.get("/tasks", (req, res) => {

    db.all(

        `SELECT * FROM tasks ORDER BY id DESC`,

        [],

        (err, rows) => {

            if (err) {

                return res.status(400).json({
                    message: "Cannot fetch tasks"
                });

            }

            res.json(rows);

        }

    );

});


/* =========================
   UPDATE TASK STATUS
========================= */

app.put("/update-task/:id", (req, res) => {

    const { status } = req.body;

    const id = req.params.id;

    db.run(

        `UPDATE tasks SET status=? WHERE id=?`,

        [status, id],

        function (err) {

            if (err) {

                return res.status(400).json({
                    message: "Update failed"
                });

            }

            res.json({
                message: "Task updated"
            });

        }

    );

});


/* =========================
   DELETE TASK
========================= */

app.delete("/delete-task/:id", (req, res) => {

    const id = req.params.id;

    db.run(

        `DELETE FROM tasks WHERE id=?`,

        [id],

        function (err) {

            if (err) {

                return res.status(400).json({
                    message: "Delete failed"
                });

            }

            res.json({
                message: "Task deleted successfully"
            });

        }

    );

});


/* =========================
   HOME ROUTE
========================= */

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "public/index.html")
    );

});


/* =========================
   SERVER
========================= */

const PORT = 3000;

app.listen(PORT, () => {

    console.log(`Server running on ${PORT}`);

});