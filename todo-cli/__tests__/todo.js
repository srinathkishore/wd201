const todoList = require("../todo");

const { all, markAsComplete, add } = todoList();

describe("Test Suite", () => {
  beforeAll(() => {
    add({
      title: "Test Item",
      completed: false,
      dueDate: new Date().toISOString(),
    });
  });

  test("ADD", () => {
    const todosCount = all.length;

    add({
      title: "Test Item",
      completed: false,
      dueDate: new Date().toISOString(),
    });

    expect(all.length).toBe(todosCount + 1);
  });

  test("MARK AS COMPLETE", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
});
