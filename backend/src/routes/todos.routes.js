import { Router } from "express";
import { createTodoCtrl, deleteTodoCtrl, getAllTodosCtrl, updateTodoCtrl } from "../controllers/todos.controllers.js";
import validarJwt from "../middlewares/validar-jwt.js";
const todosRouter = Router();

todosRouter.get("/",validarJwt, getAllTodosCtrl);
todosRouter.post("/",validarJwt, createTodoCtrl);
todosRouter.put("/:id", validarJwt, updateTodoCtrl);
todosRouter.delete("/:id", validarJwt, deleteTodoCtrl);

export { todosRouter };
