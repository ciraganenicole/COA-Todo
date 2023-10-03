import { StatusCodes } from "http-status-codes";
import { Todo } from "../db/models";

export const createTodo = async (req, res) => {
    const { title, description } = req.body;
  
    try {
      const newTodo = await Todo.create({
        title,
        description,
      });
  
      return res.status(StatusCodes.CREATED).json({
        status: "success",
        message: "Todo created successfully",
        newTodo,
      });
    } catch (error) {
      console.error("Error creating todo:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Failed to create todo",
      });
    }
  };

  export const getAllTodos = async (req, res) => {
    const db = await Todo.findAll({});
    if (db.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: "The todo you are looking for was not found" });
    }
    return res.status(StatusCodes.OK).send({
      status: "success",
      message: "Todos retrieved successfully",
      db,
    });
  };