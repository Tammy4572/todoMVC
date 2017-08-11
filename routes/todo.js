const mongoose = require('mongoose');
    Todos = mongoose.model('Todos');

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    order: { type: Number, required: true },
    completed: { type: Boolean, default: false }
});

const Todos = mongoose.model('Todos', todoSchema);

module.exports = Todos;