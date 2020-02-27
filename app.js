const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config.js');

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const ToDos = require('./models/todos');
const bodyParser = require('body-parser');
mongoose.Promise = require('bluebird');

const express = require('express');
// const blue = require('./controllers');
const app = express();

mongoose.connect('mongodb://localhost:27017/todoMVC');
const compiler = webpack(webpackConfig);

app.use(express.static(__dirname + '/public'));

app.use(webpackDevMiddleware(compiler, {
    hot: true,
    filename: 'bundle.js',
    publicPath: '/',
    stats: {
        colors: true,
    },
    historyApiFallback: true,
}));

// app.use('/public', express.static('public'));
app.use(bodyParser.json());

app.get('/',  function(request, response) {
    response.sendFile(__dirname + "./index.html");
});

app.get('/api/todos', async (request, response) => {
    var results = await ToDos.find();
    if(!results) {
        response.status(404);
        return response.end();
    }
    response.json(results);
});

app.get('/api/todos/:id', async (request, response) => {
    var id = request.params.id;
    var todo = await ToDos.find({ _id: id});

    if (!todo) {
        response.status(404);
        return response.end();
    }
    return response.json(todo);
});

app.post('/api/todos', async(request, response) => {
    var newTodo = new ToDos({
        title: request.body.title,
        order: await ToDos.count() +1,
        completed: false
    })
    newTodo.save();
    response.status(200);
    return response.json(newTodo);
});

app.put('/api/todos/:id', async (request, response) => {
    var id = request.params.id;
    var title = request.body.title;
    await ToDos.findOneAndUpdate({ _id: id},
        {
            $set: {
                title: title
            }
        }
    );
    var updated = await ToDos.find({ _id: id});
    return response.json(updated);
});

app.patch('/api/todos/:id', (request, response) => {
    var id = request.params.id;
    var updateObject = req.body;
    Todos.title.update({ _id : ObjectId(id)}, { $set: updateObject});
});

app.delete('/api/todos/:id', async (request, response) => {
    var id = request.params.id;
    var todo = await ToDos.findOne({ _id: id});
    var deleted = await ToDos.deleteOne({ _id: id});
    return response.json(todo);
});

app.listen(3000, function () {
    console.log('Express running on http://localhost:3000/.')
});
