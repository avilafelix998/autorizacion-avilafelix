import { database } from "../db/database.js";

export const getAllTodosCtrl = (req, res) => {
  const userId = req.user.id; // obtener el id del usuario autenticado

//filtrar las tareas que corresponden al usuario autenticado
  const userTodos = database.todos.filter((todo) => todo.owner === userId);

  res.json({ todos: userTodos });
};

//CREAR TAREAS
export const createTodoCtrl = (req, res) => {
  const userId = req.user.id; // Obtener el id del usuario autenticado
  const { title, completed } = req.body; // Obtener los datos de la tarea del cuerpo de la solicitud

  // Verificar que se recibieron todos los campos necesarios
  if (!title || completed === undefined) {
    return res.status(400).json({ message: "Faltan campos requeridos" });
  }

  // Crear una nueva tarea
  const newTodo = {
    id: database.todos.length + 1, // Asignar un nuevo ID
    title,
    completed,
    owner: userId, // Asignar el ID del usuario autenticado
  };

  // Añadir la nueva tarea a la base de datos
  database.todos.push(newTodo);

  res.status(201).json({ message: "Tarea creada con éxito", todo: newTodo });
};


//EDITAR TAREAS
export const updateTodoCtrl = (req, res) => {
  const userId = req.user.id; // Obtener el id del usuario autenticado
  const { id } = req.params; // Obtener el ID de la tarea desde los parámetros de la solicitud
  const { title, completed } = req.body; // Obtener los datos a actualizar del cuerpo de la solicitud

  // Encontrar la tarea por ID
  const todo = database.todos.find((todo) => todo.id === parseInt(id));

  // Verificar si la tarea existe y si pertenece al usuario autenticado
  if (!todo) {
    return res.status(404).json({ message: "Tarea no encontrada" });
  }
  if (todo.owner !== userId) {
    return res.status(403).json({ message: "No tienes permiso para editar esta tarea" });
  }

  // Actualizar los campos de la tarea
  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = completed;

  res.json({ message: "Tarea actualizada con éxito", todo });
};


//ELIMINAR TAREAS
export const deleteTodoCtrl = (req, res) => {
  const userId = req.user.id; // Obtener el id del usuario autenticado
  const { id } = req.params; // Obtener el ID de la tarea desde los parámetros de la solicitud

  // Encontrar la tarea por ID
  const todoIndex = database.todos.findIndex((todo) => todo.id === parseInt(id));

  // Verificar si la tarea existe
  if (todoIndex === -1) {
    return res.status(404).json({ message: "Tarea no encontrada" });
  }
  
  // Verificar que la tarea pertenece al usuario autenticado
  const todo = database.todos[todoIndex];
  if (todo.owner !== userId) {
    return res.status(403).json({ message: "No tienes permiso para eliminar esta tarea" });
  }

  // Eliminar la tarea
  database.todos.splice(todoIndex, 1);

  res.json({ message: "Tarea eliminada con éxito" });
};