import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import app from './app';
import db from './db/db';

describe('Todos tests', () => {
  describe('GET TODOS', () => {
    it('Todos should be empty', async () => {
      const response = await request(app).get('/api/v1/todos');
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.todos.length).toBe(0);
    });

    it('We should create a todo', async () => {
      const response = await request(app).post('/api/v1/todos').send(
        {
          title: 'Lunch',
          description: 'Go for lunch in the morning',
          date: '2023-09-15',
          isCompleted: false,
          isDeleted: false,
        },
      );
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body.message).toBe('Todo added successfully');
    });

    it('Should return Bad request if the title is empty', async () => {
      const response = await request(app).post('/api/v1/todos').send(
        {
          title: '',
          description: 'Go for lunch in the morning',
          date: '2023-09-15',
          isCompleted: false,
          isDeleted: false,
        },
      );
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.message).toBe('Title cannot be empty');
    });

    it('Should return Bad request if the description is empty', async () => {
      const response = await request(app).post('/api/v1/todos').send(
        {
          title: 'Lunch',
          description: '',
          date: '2023-09-15',
          isCompleted: false,
          isDeleted: false,
        },
      );
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.message).toBe('Description cannot be empty');
    });

    it('We should get all todos', async () => {
      const response = await request(app).get('/api/v1/todos');
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.todos.length).toBe(1);
    });
  });

  describe('GET TODO By ID', () => {
    it('We should get a todo by id', async () => {
      const response = await request(app).get(`/api/v1/todos/${1}/single`);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.item.id).toBe(1);
    });

    it('We should get a todo by id', async () => {
      const response = await request(app).get(`/api/v1/todos/${100}/single`);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body.message).toBe('Todo does not exist');
    });

    it('Title and description should be updated', async () => {
      const response = await request(app).put(`/api/v1/todos/${1}/update`).send(
        {
          title: 'Lunch by 2am',
          description: 'Lunch with friends',
          date: '2023-09-15',
          isCompleted: false,
          isDeleted: false,
        },
      );
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.message).toBe('Todo updated successfully');
    });

    it('Todo should use default values to be updated', async () => {
      const req = {
        params: {
          id: 1,
        },
        body: {},
      };
      const response = await request(app).put(`/api/v1/todos/${1}/update`).send(req.body);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual({
        success: true,
        message: 'Todo updated successfully',
        updatedTodo: {
          id: 1,
          title: 'Lunch by 2am',
          description: 'Lunch with friends',
          date: '2023-09-15',
          isCompleted: false,
          isDeleted: false,
        },
      });
      expect(response.body.message).toBe('Todo updated successfully');
    });

    it('Todo not found', async () => {
      const response = await request(app).put(`/api/v1/todos/${100}/update`);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body.message).toBe('Todo not found');
    });

    it('Todo should be completed', async () => {
      const response = await request(app).put(`/api/v1/todos/${1}/completed`);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.message).toBe('Todo completed successfully');
    });

    it('Todo not found', async () => {
      const response = await request(app).put(`/api/v1/todos/${100}/completed`);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body.message).toBe('Todo not found');
    });

    it('Todo not found', async () => {
      const response = await request(app).delete(`/api/v1/todos/${100}/delete`);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body.message).toBe('Todo not found');
    });

    it('Todo should be deleted using soft delete', async () => {
      const response = await request(app).delete(`/api/v1/todos/${1}/delete`);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.message).toBe('Todo deleted successfully');
    });

    it('We should get all deleted todos', async () => {
      const response = await request(app).get('/api/v1/deleted');
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.todos.length).toBe(1);
    });

    it('should send a 404 message if the deleted todos were not found', async () => {
      db.length = 0;
      const response = await request(app).get('/api/v1/deleted');
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body.message).toBe(
        'The todo you are looking for was not found',
      );
    });
  });
});
