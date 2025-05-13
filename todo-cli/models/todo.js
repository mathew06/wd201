/* eslint-disable no-unused-vars */
"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      const overdue = await Todo.overdue();
      const overdueTodos = overdue
        .map((todo) => todo.displayableString())
        .join("\n");
      console.log(overdueTodos);
      console.log("\n");

      console.log("Due Today");
      const dueToday = await Todo.dueToday();
      const dueTodayTodos = dueToday
        .map((todo) => todo.displayableString())
        .join("\n");
      console.log(dueTodayTodos);
      console.log("\n");

      console.log("Due Later");
      const dueLater = await Todo.dueLater();
      const dueLaterTodos = dueLater
        .map((todo) => todo.displayableString())
        .join("\n");
      console.log(dueLaterTodos);
    }

    static async overdue() {
      try {
        const overdueTodos = await Todo.findAll({
          where: {
            dueDate: {
              [Op.lt]: new Date(),
            },
          },
          order: [["id", "ASC"]],
        });
        return overdueTodos;
      } catch (error) {
        console.error("Error fetching overdue todos:", error);
      }
    }

    static async dueToday() {
      try {
        const dueTodayTodos = await Todo.findAll({
          where: {
            dueDate: {
              [Op.eq]: new Date(),
            },
          },
          order: [["id", "ASC"]],
        });
        return dueTodayTodos;
      } catch (error) {
        console.error("Error fetching dueToday todos:", error);
      }
    }

    static async dueLater() {
      try {
        const dueLaterTodos = await Todo.findAll({
          where: {
            dueDate: {
              [Op.gt]: new Date(),
            },
          },
          order: [["id", "ASC"]],
        });
        return dueLaterTodos;
      } catch (error) {
        console.error("Error fetching dueLater todos:", error);
      }
    }

    static async markAsComplete(id) {
      try {
        await Todo.update(
          {
            completed: true,
          },
          {
            where: {
              id: id,
            },
          },
        );
      } catch (error) {
        console.error("Error in mark as complete todo:", error);
      }
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      const today = new Date().toISOString().slice(0, 10);
      return `${this.id}. ${checkbox} ${this.title}${this.dueDate === today ? "" : " " + this.dueDate}`;
    }
  }

  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    },
  );
  return Todo;
};
