const express = require("express");
const bodyParser = require("body-parser");
const csrf = require("tiny-csrf");
const cookieParser = require("cookie-parser");
const { Todo } = require("./models");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("secret_string"));
app.use(csrf("thirtytwo_character_secretstring", ["POST", "PUT", "DELETE"]));

app.set("view engine", "ejs");
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  const overdue = await Todo.overdue();
  const dueToday = await Todo.dueToday();
  const dueLater = await Todo.dueLater();
  if (req.accepts("html")) {
    res.render("index", {
      overdue,
      dueToday,
      dueLater,
      csrfToken: req.csrfToken(),
    });
  } else {
    res.json({ overdue, dueToday, dueLater });
  }
});

app.get("/todos", async (req, res) => {
  console.log("Processing list of all Todos ...");
  const todos = await Todo.getTodos();
  return res.send(todos);
});

app.post("/todos", async (req, res) => {
  try {
    console.log("Creating a todo", req.body);
    await Todo.addTodo({
      title: req.body.title,
      dueDate: req.body.dueDate,
    });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return res.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async (req, res) => {
  console.log("Marking task as completed of id", req.params.id);
  try {
    const todo = await Todo.findByPk(req.params.id);
    const updatedTodo = await todo.markAsCompleted();
    return res.json(updatedTodo);
  } catch (error) {
    console.error(error);
    return res.status(422).json(error);
  }
});

app.delete("/todos/:id", async (req, res) => {
  console.log("We have to delete a Todo with ID: ", req.params.id);
  try {
    await Todo.remove(req.params.id);
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(422).json(error);
  }
});

module.exports = app;
