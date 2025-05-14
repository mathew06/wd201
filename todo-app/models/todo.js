/* eslint-disable */
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

    static addTodo({ title, dueDate }) {
      return this.create({ title: title, dueDate: dueDate, completed: false });
    }

    static getTodos() {
      return this.findAll();
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

    markAsCompleted() {
      return this.update({ completed: true });
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
