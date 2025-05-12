const { connect } = require("./connectDB.js");
const Todo = require("./TodoModel.js");

const createTodo = async () => {
  try {
    await connect();
    const todo = await Todo.create({
      title: "First Todo",
      dueDate: new Date(),
      completed: false,
    });
    console.log(`Created todo with ID: ${todo.id}`);
  } catch (error) {
    console.error(error);
  }
};

(async () => {
  await createTodo();
})();
