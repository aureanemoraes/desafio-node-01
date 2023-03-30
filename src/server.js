import { randomUUID } from 'node:crypto';
import http from 'node:http';
import Database from '../database/index.js';
import ReqToJson from '../middlewares/reqToJson.js';
import TasksValidator from '../validation/tasksValidator.js';

const db = new Database();


const server = http.createServer(async (req, res) => {
    await ReqToJson(req, res);

    if (req.method === 'POST' && req.url === '/tasks') {
        const validation = TasksValidator(req, res);

        if (!validation.validated)
            return res.writeHead(412).end(validation.msg);

        const { title, description } = req.body;

        const newTask = db.insert('tasks', {
            title,
            description,
            completed_at: null,
            
        });

        return res.writeHead(201).end(JSON.stringify(newTask));
    }

    if (req.method === 'GET' && req.url === '/tasks') {
        const tasks = db.select('tasks');

        return res.end(JSON.stringify(tasks));
    }

    if (req.method === 'PUT' && req.url.match(/^\/tasks\/[a-zA-Z0-9-]*\/?$/)) {
        const id = req.url.split("/").filter(string => string.length > 0).find(string => string !== 'tasks');

        const validation = TasksValidator(req, res);

        if (!validation.validated)
            return res.writeHead(412).end(validation.msg);

        const { title, description } = req.body;

        const task = db.update('tasks', id, {
            title,
            description
        });

        if (!task)
            return res.writeHead(404).end('Item não encontrado.');

        return res.end(JSON.stringify(task));
    }

    if (req.method === 'DELETE' && req.url.match(/^\/tasks\/[a-zA-Z0-9-]*\/?$/)) {
        const id = req.url.split("/").filter(string => string.length > 0).find(string => string !== 'tasks');

        const index = tasks.findIndex(task => task.id === id);

        if (index == -1)
            return res.writeHead(404).end("Item não encontrado.");

        tasks = tasks.filter(task => task.id !== id);

        return res.writeHead(204).end();
    }

    if (req.method === 'PATCH' && req.url.match(/^\/tasks\/[a-zA-Z0-9-]*\/complete\/?$/)) {
        const id = req.url.split("/").filter(string => string.length > 0).find(string => string !== 'tasks');

        const index = tasks.findIndex(task => task.id === id);

        if (index == -1)
            return res.writeHead(404).end("Item não encontrado.");

        tasks = tasks.map(task => {
            if (task.id === id) 
                return {
                    ...task,
                    completed_at: new Date(),
                    updated_at: new Date()
        
                }

            return task;
        });

        return res.end(JSON.stringify(tasks[index]));
    }

    if (req.method === 'POST' && req.url === '/tasks/import') {
        const validation = TasksValidator(req, res);

        if (!validation.validated)
            return res.writeHead(412).end(validation.msg);

        const { title, description } = req.body;

        const newTask = db.insert('tasks', {
            title,
            description,
            completed_at: null,
            
        });

        return res.writeHead(201).end(JSON.stringify(newTask));
    }

    
    return res.writeHead(404).end('Página não encontrada :(');
});

server.listen(3333);