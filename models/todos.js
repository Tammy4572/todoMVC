const mongoose = require('mongoose');

const todoScheme = new mongoose.Schema({
    title: { type: String, required: true },
    order: { type: Number, default: 1 },
    completed: { type: Boolean, default: false }
});

const ToDos = mongoose.model('ToDos', todoScheme);

module.exports = ToDos;