/* eslint-disable comma-dangle */
/* eslint-disable indent */
/* eslint-disable arrow-parens */
/* eslint-disable linebreak-style */
/* eslint-disable object-curly-spacing */
/* eslint-disable quotes */

const { connect } = require("./connectDB.js");
const Todo = require("./TodoModel.js");

const createTodo = async () => {
  try {
    await connect();
    const todo = await Todo.addTask({
      title: "Second Item",
      dueDate: new Date(),
      completed: false,
    });
    console.log(`Created todo with ID: ${todo.id}`);
  } catch (error) {
    console.error();
  }
};

const countItems = async () => {
  try {
    const totalCount = await Todo.count();
    console.log(`Item count: ${totalCount}`);
  } catch (error) {
    console.log(error);
  }
};

const getAllTodos = async () => {
  try {
    const todos = await Todo.findAll();
    const todoList = todos.map((todo) => todo.displayableString()).join(`\n`);
    console.log(todoList);
  } catch (error) {
    console.error(error);
  }
};

const getSingleTodo = async () => {
  try {
    const todo = await Todo.findOne();
    console.log(todo.displayableString());
  } catch (error) {
    console.error(error);
  }
};

const updateTodo = async (id) => {
  try {
    await Todo.update(
      { completed: true },
      {
        where: {
          id: id,
        },
      }
    );
  } catch (error) {
    console.error(error);
  }
};

const deleteTodo = async (id) => {
  try {
    const deleted = await Todo.destroy({
      where: {
        id: id,
      },
    });
    console.log(`Deleted ${deleted} ${deleted === 1 ? "row" : "rows"}!`);
  } catch (error) {
    console.error(error);
  }
};

(async () => {
  await createTodo();
  //   await countItems();
  await getAllTodos();
  //   await getSingleTodo();
  //   await updateTodo(2);
  // await deleteTodo(2);
  // await getAllTodos();
})();
