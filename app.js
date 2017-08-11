const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Todos = require('./models/todos');
const bodyParser = require('body-parser');
const router = express.Router();

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/todoMVC');

app.use('/static', express.static('static'));
app.use(bodyParser.json());

app.get('/',  function(request, response) {
    response.sendFile(__dirname + "/static/index.html");
});

//returns a JSON array of todo items
app.get('/api/todos', async (request, response) => {
    var results = await Todos.find();
    if(!results) {
        response.status(404);
        return response.end();
    }
    response.json(results);
});

//get a specific todo item
app.get('/api/todos/:id', async (request, response) => {
    var id = request.params.id;
    var todo = await Todos.find({ _id: id});

    if (!todo) {
        response.status(404);
        return response.end();
    }
    return response.json(todo);
});

//return a saved todo JSON item
app.post('/api/todos', async(request, response) => {
    var newTodo = new Todos({
        title: request.body.title,
        order: await Todos.count() +1,
        completed: false
    })
    newTodo.save();
    response.status(200);
    return response.json(newTodo);
});

//update a todo item - returns the modified todo item
app.put('/api/todos/:id', async (request, response) => {
    var id = request.params.id;
    let title = request.body.title;
    await Todos.findOneAndUpdate({ _id: id },
        {
            $set: {
                title: title,
                completed: completed
            }
        }
    );
    let updated = await Todos.find({ _id: id })

    return response.json(updated);
});

//delete a todo item - returns the todo item that was deleted
app.delete('/api/todos/:id', async (request, response) => {
    var id = request.params.id;
    var todo = await Todos.findOne({ _id: id});
    var deleted = await Todos.deleteOne({ _id: id});
    return response.json(todo);
});

app.listen(3000, function () {
    console.log('Express running on http://localhost:3000/.')
});
