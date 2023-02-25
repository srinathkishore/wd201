/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable comma-dangle */
/* eslint-disable indent */

const todoList = require("../todo");

describe("TODO List", () => {
  const formattedDate = (d) => {
    return d.toISOString().split("T")[0];
  };

  const dateToday = new Date();
  const today = formattedDate(dateToday);

  const yesterday = formattedDate(
    new Date(new Date().setDate(dateToday.getDate() - 1))
  );

  const tomorrow = formattedDate(
    new Date(new Date().setDate(dateToday.getDate() + 1))
  );

  let todos;
  beforeAll(() => {
    todos = todoList();
  });

  test("ADD", () => {
    const initCount = todos.all.length;
    todos.add({
      title: "Submit assignment",
      dueDate: yesterday,
      completed: false,
    });

    expect(todos.all.length).toBe(initCount + 1);
  });

  test("MARK AS COMPLETE", () => {
    expect(todos.all[0].completed).toBe(false);
    todos.markAsComplete(0);
    expect(todos.all[0].completed).toBe(true);
  });

  test("OVERDUE", () => {
    todos.add({
      title: "Submit assignment",
      dueDate: yesterday,
      completed: false,
    });

    expect(todos.overdue()).toHaveLength(1);
    expect(todos.overdue()[0].title).toBe("Submit assignment");
  });

  test("DUE LATER", () => {
    todos.add({ title: "Pay Rent", dueDate: tomorrow, completed: false });

    expect(todos.dueLater()).toHaveLength(1);
    expect(todos.dueLater()[0].title).toBe("Pay Rent");
  });

  test("DUE TODAY", () => {
    todos.add({ title: "Service Vehicle", dueDate: today, completed: false });
    expect(todos.dueToday()).toHaveLength(1);
  });
});
