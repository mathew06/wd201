const express = require("express");
const bodyParser = require("body-parser");
const csrf = require("tiny-csrf");
const cookieParser = require("cookie-parser");
const { Todo, User } = require("./models");
const path = require("path");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("secret_string"));
app.use(csrf("thirtytwo_character_secretstring", ["POST", "PUT", "DELETE"]));

app.use(
  session({
    secret: "todo-session-secret-key",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({
        where: { email: username },
      })
        .then(async (user) => {
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done("Invalid password");
          }
        })
        .catch((error) => {
          return error;
        });
    },
  ),
);

passport.serializeUser((user, done) => {
  console.log("Serializing user in session", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => done(null, user))
    .catch((error) => done(error, null));
});

app.set("view engine", "ejs");
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { csrfToken: req.csrfToken() });
});

app.get("/signup", (req, res) => {
  res.render("signup", { csrfToken: req.csrfToken() });
});

app.get("/login", (req, res) => {
  res.render("login", { csrfToken: req.csrfToken() });
});

app.post(
  "/session",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    console.log(req.user);
    res.redirect("/todos");
  },
);

app.post("/users", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  try {
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
    });
    req.login(user, (err) => {
      if (err) {
        console.error(err);
      }
      res.redirect("/todos");
    });
  } catch (error) {
    console.error(error);
  }
});

app.get("/todos", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const overdue = await Todo.overdue();
  const dueToday = await Todo.dueToday();
  const dueLater = await Todo.dueLater();
  const completed = await Todo.completed();
  if (req.accepts("html")) {
    res.render("todos", {
      overdue,
      dueToday,
      dueLater,
      completed,
      csrfToken: req.csrfToken(),
    });
  } else {
    res.json({ overdue, dueToday, dueLater, completed });
  }
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

app.put("/todos/:id", async (req, res) => {
  console.log("Changing completion status of task with id", req.params.id);
  try {
    const todo = await Todo.findByPk(req.params.id);
    const updatedTodo = await todo.setCompletionStatus(req.body.completed);
    console.log(`id: ${updatedTodo.id}, completed: ${updatedTodo.completed}`);
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
