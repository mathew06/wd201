const Sequelize = require("sequelize");

const database = "todo_db";
const username = "postgres";
const password = "passdb";

const sequelize = new Sequelize(database, username, password, {
  host: "localhost",
  dialect: "postgres",
});

const connect = async () => sequelize.authenticate();

module.exports = {
  connect,
  sequelize,
};
