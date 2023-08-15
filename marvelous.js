const express = require('express');
const cors = require('cors');
const port = 3000;
const fs = require('fs');
const shortId = require('shortid');
const app = express();

const corsOptions = {
    AccessControllAllowOrigin: '*',
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,OPTIONS,DELETE'
}

app.use(cors(corsOptions));
app.use(express.json());

app.get('/tasks', (req, res) => {
    fs.readFile('./tasks.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({error: 'Error reading tasks file' });
        }

        const tasks = JSON.parse(data);

        res.json(tasks);
    });
});

app.post('/tasks', (req, res) => {
    fs.readFile('./tasks.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({error: 'Error reading tasks file' });
        }

        const tasks = JSON.parse(data);
        console.log(tasks);
        const newTask = {
            id: shortId.generate(),
            description: req.body.description,
            status: 'incomplete',
            created_at: new Date().toISOString(),
            completed_at: ''
        }
        
        tasks.push(newTask);

        fs.writeFile('./tasks.json', JSON.stringify(tasks), 'utf8', err => {
            if (err) {
                return res.status(500).json({error: 'Error writing to tasks file' });
            }

            res.status(201).json(newTask);
        });
    });
});

app.put('/tasks/:id', (req, res) => {
    console.log("putting")
    console.log(req.params)
    fs.readFile('./tasks.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({error: 'Error reading tasks file' });
        }

        const tasks = JSON.parse(data);

        const taskIndex = tasks.findIndex((task) => task.id === req.params.id);

        console.log(taskIndex)
        console.log(req.body)

        if (taskIndex === -1) {
            return req.status(404).json({ error: 'Task not found' });
        }

        tasks[taskIndex] = {
            ...tasks[taskIndex],
            status: req.body.updatedTask.status,
            completed_at: new Date().toISOString()
        }

        console.log(tasks[taskIndex])

        fs.writeFile('./tasks.json', JSON.stringify(tasks), 'utf8', err => {
            if (err) {
                return res.status(500).json({error: 'Error writing to tasks file' });
            }

            res.json(tasks[taskIndex]);
        });
    });
});

app.delete('/tasks/all', (req, res) => {
    fs.readFile('./tasks.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({error: 'Error reading tasks file' });
        }

        const tasks = [];

        fs.writeFile('./tasks.json', JSON.stringify(tasks), 'utf8', err => {
            if (err) {
                return res.status(500).json({error: 'Error writing to tasks file' });
            }

            res.json(tasks);
        });
    });
});

app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
})