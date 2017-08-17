const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Todos = require('./models/todos.js');
const bodyParser = require('body-parser');
const router = express.Router();

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/todos');

app.use(bodyParser.json());
app.use('/static', express.static('static'));

app.get('/', function(request, response) {
    response.sendFile(__dirname + "/static/index.html");
});

//returns a JSON array of todo items
app.get('/api/todos', async (request, response) => {
    var todos = await Todos.find();
    response.json(todos);
});

//get a specific todo item
app.get('/api/todos/:id', async (request, response) => {

    let todos = await Todos.findOne({ id: parseInt(request.params.id)});
    response.json(todos);
});

//return a saved todo JSON item
app.post('/api/todos', async(request, response) => {
     var title = request.body;
     let todos = new Todos(request.body)
          todos.save(function(err, newTodo){
               response.json(newTodo);
          })
});

//update a todo item - returns the modified todo item
app.put('/api/todos/:id', async (request, response) => {
     await Todos.updateOne(
          {id: parseInt(request.params.id)},
          {title: request.body.title,
          order: request.body.order,
          completed: request.body.completed
          }
     );
     var todo = await Todos.find({id: parseInt(request.params.id)});
     request.json(todos);
});

//delete a todo item - returns the todo item that was deleted
app.delete('/api/todos/:id', async (request, response) => {
    let todos = await Todos.findOne({ id: parseInt(request.params.id)});
    await Todos.deleteOne({ id: parseInt(request.params.id)});
    response.json(todo);
});

app.listen(3000, function () {
    console.log('Express running on http://localhost:3000/.')
});
