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
      Todo.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }

    static addTodo({ title, dueDate }) {
      return this.create({ title: title, dueDate: dueDate, completed: false });
    }

    static getTodos() {
      return this.findAll();
    }

    static async overdue() {
      try {
        const overdueTodos = await this.findAll({
          where: {
            [Op.and]: [
              {
                dueDate: {
                  [Op.lt]: new Date(),
                },
              },
              {
                completed: false,
              },
            ],
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
        const dueTodayTodos = await this.findAll({
          where: {
            [Op.and]: [
              {
                dueDate: {
                  [Op.eq]: new Date(),
                },
              },
              {
                completed: false,
              },
            ],
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
        const dueLaterTodos = await this.findAll({
          where: {
            [Op.and]: [
              {
                dueDate: {
                  [Op.gt]: new Date(),
                },
              },
              {
                completed: false,
              },
            ],
          },
          order: [["id", "ASC"]],
        });
        return dueLaterTodos;
      } catch (error) {
        console.error("Error fetching dueLater todos:", error);
      }
    }

    static async completed() {
      try {
        const completedTodos = await this.findAll({
          where: {
            completed: true,
          },
          order: [["id", "ASC"]],
        });
        return completedTodos;
      } catch (error) {
        console.error("Error fetching completed todos:", error);
      }
    }

    static async remove(id) {
      return this.destroy({
        where: {
          id,
        },
      });
    }

    setCompletionStatus(completed) {
      return this.update({ completed: completed });
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
