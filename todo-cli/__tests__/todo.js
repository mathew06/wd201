const todoList = require("../todo");

const { all, add, markAsComplete } = todoList();

describe("TodoList Test Suite", () => {
  test("Should add new todo", () => {
    expect(all.length).toBe(0);
    add({
      title: "Test Todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    expect(all.length).toBe(1);
  });

  test("Should mark todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
});
