/* eslint-disable no-undef */
const todoList = require("../todo");

const { all, add, markAsComplete } = todoList();

describe("TodoList Test Suite", () => {
  beforeAll(() => {
    add({
      title: "Test Todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    add({
      title: "Submit assignment",
      dueDate: new Date(new Date().setDate(new Date().getDate() - 1))
        .toISOString()
        .slice(0, 10),
      completed: false,
    });
    add({
      title: "File taxes",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .slice(0, 10),
      completed: false,
    });
  });

  test("Should add new todo", () => {
    let todoCount = all.length;
    add({
      title: "Test Todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    expect(all.length).toBe(todoCount + 1);
  });

  test("Should mark todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });

  test("Should return overdue todos", () => {
    const overdueTodos = all.filter(
      (todo) => todo.dueDate < new Date().toISOString().slice(0, 10),
    );
    expect(overdueTodos.length).toBe(1);
  });

  test("Should return todos due today", () => {
    const todayTodos = all.filter(
      (todo) => todo.dueDate === new Date().toISOString().slice(0, 10),
    );
    expect(todayTodos.length).toBe(2);
  });

  test("Should return todos due later", () => {
    const laterTodos = all.filter(
      (todo) => todo.dueDate > new Date().toISOString().slice(0, 10),
    );
    expect(laterTodos.length).toBe(1);
  });
});
