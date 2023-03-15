/* eslint-disable no-unused-vars */
const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
const { where } = require("sequelize");
const dirname = path.resolve();

app.use(bodyParser.json());

app.set("view engine", "ejs");
app.get("/", async (request, response) => {
  const allTodos = await Todo.getTodos();
  if (request.accepts("html")) {
    response.render("index", { allTodos });
  } else {
    response.json(allTodos);
  }
});

app.use(express.static(path.join(dirname, "public")));

app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");
  const todos = await Todo.findAll();
  console.log(todos);
  response.send(todos);
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    if (!todo) {
      return response.status(404).json(false);
    }
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  try {
    const todo = await Todo.addTodo(request.body);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  const todo = await Todo.findByPk(request.params.id);

  try {
    if (!todo) {
      return response.status(404).json(false);
    }
    await todo.destroy();
    return response.status(200).json(true);
  } catch (error) {
    console.log(error);
    return response.status(422).json({ message: "Error deleting todo" });
  }
});

module.exports = app;
