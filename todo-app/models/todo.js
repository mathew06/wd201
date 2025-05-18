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

    static addTodo({ title, dueDate, userId }) {
      return this.create({
        title: title,
        dueDate: dueDate,
        completed: false,
        userId,
      });
    }

    static getTodos() {
      return this.findAll();
    }

    static async overdue(userId) {
      try {
        const overdueTodos = await this.findAll({
          where: {
            userId,
            dueDate: {
              [Op.lt]: new Date(),
            },
            completed: false,
          },
          order: [["id", "ASC"]],
        });
        return overdueTodos;
      } catch (error) {
        console.error("Error fetching overdue todos:", error);
      }
    }

    static async dueToday(userId) {
      try {
        const dueTodayTodos = await this.findAll({
          where: {
            userId,
            dueDate: {
              [Op.eq]: new Date(),
            },
            completed: false,
          },
          order: [["id", "ASC"]],
        });
        return dueTodayTodos;
      } catch (error) {
        console.error("Error fetching dueToday todos:", error);
      }
    }

    static async dueLater(userId) {
      try {
        const dueLaterTodos = await this.findAll({
          where: {
            userId,
            dueDate: {
              [Op.gt]: new Date(),
            },
            completed: false,
          },
          order: [["id", "ASC"]],
        });
        return dueLaterTodos;
      } catch (error) {
        console.error("Error fetching dueLater todos:", error);
      }
    }

    static async completed(userId) {
      try {
        const completedTodos = await this.findAll({
          where: {
            userId,
            completed: true,
          },
          order: [["id", "ASC"]],
        });
        return completedTodos;
      } catch (error) {
        console.error("Error fetching completed todos:", error);
      }
    }

    static async remove(id, userId) {
      return this.destroy({
        where: {
          id,
          userId,
        },
      });
    }

    setCompletionStatus(completed) {
      return this.update({ completed: completed });
    }
  }
  Todo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          len: 5,
        },
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: true,
          notNull: true,
        },
      },
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    },
  );
  return Todo;
};
