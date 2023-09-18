import express from 'express';
import bodyParser from 'body-parser';
import db from './db/db';
import validation from './validation';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/v1/todos', (req, res) => {
  const { error } = validation.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const todo = {
    id: db.length + 1,
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    isCompleted: false,
    isDeleted: false,
  };
  db.push(todo);
  return res.status(201).send({
    success: true,
    message: 'Todo added successfully',
    todo,
  });
});

app.get('/api/v1/todos/:id/single', (req, res) => {
  const id = parseInt(req.params.id, 10);

  const item = db.find((value) => value.id === id);

  if (!item) {
    return res.status(404).send({
      success: false,
      message: 'Todo does not exist',
    });
  }
  return res.status(200).send({
    success: true,
    message: 'Todo retrieved successfully',
    item,
  });
});

app.put('/api/v1/todos/:id/update', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = db.find((value) => value.id === id);
  const index = db.findIndex((value) => value.id === id);

  if (index === -1) {
    return res.status(404).send({
      success: false,
      message: 'Todo not found',
    });
  }

  const updatedTodo = {
    id: item.id,
    title: req.body.title || item.title,
    description: req.body.description || item.description,
    date: req.body.date || item.date,
    isCompleted: req.body.isCompleted || item.isCompleted,
    isDeleted: req.body.isDeleted || item.isDeleted,
  };

  db[index] = updatedTodo;

  return res.status(200).send({
    success: true,
    message: 'Todo updated successfully',
    updatedTodo,
  });
});

app.get('/api/v1/todos', (req, res) => {
  res.status(200).send({
    success: true,
    message: 'Todos retrieved successfully',
    todos: db.filter((value) => value.isDeleted === false),
  });
});

app.put('/api/v1/todos/:id/completed', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = db.find((value) => value.id === id);
  const index = db.findIndex((value) => value.id === id);

  if (index === -1) {
    return res.status(404).send({
      success: false,
      message: 'Todo not found',
    });
  }

  const completedTodo = {
    id: item.id,
    title: req.body.title || item.title,
    description: req.body.description || item.description,
    date: req.body.date || item.date,
    isCompleted: req.body.isCompleted || item.isCompleted,
    isDeleted: req.body.isDeleted || item.isDeleted,
  };

  db[index] = completedTodo;

  return res.status(200).send({
    success: true,
    message: 'Todo completed successfully',
    completedTodo,
  });
});

app.delete('/api/v1/todos/:id/delete', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = db.findIndex((value) => value.id === id && !value.isDeleted);
  if (index === -1) {
    return res.status(404).send({
      success: false,
      message: 'Todo not found',
    });
  }

  db[index].isDeleted = true;

  return res.status(200).send({
    success: true,
    message: 'Todo deleted successfully',
  });
});

app.get('/api/v1/deleted', (req, res) => {
  if (db.length === 0) {
    return res.status(404).send({
      success: false,
      message: 'The todo you are looking for was not found',
    });
  }
  return res.status(200).send({
    success: true,
    message: 'Deleted todos retrieved successfully',
    todos: db.filter((todo) => todo.isDeleted === true),
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

export default app;
