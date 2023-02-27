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

(async () => {
  await createTodo();
})();
