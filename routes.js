import { Router } from 'express';
import {
  getAllTodos,
  createTodo,
} from './controllers/todo';

const router = Router()
  .post('/todos', createTodo)
  .get('/todos', getAllTodos)
export default router;