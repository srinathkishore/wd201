/* eslint-disable object-curly-spacing */
/* eslint-disable comma-dangle */
/* eslint-disable indent */
/* eslint-disable require-jsdoc */
/* eslint-disable quotes */

// models/todo.js
"use strict";
const { Sequelize } = require("sequelize");
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log("My Todo list\n");

      console.log("Overdue");
      const overdueTasks = await Todo.overdue();
      overdueTasks.forEach((task) => console.log(task.displayableString()));
      console.log("\n");

      console.log("Due Today");
      const dueTodayTasks = await Todo.dueToday();
      dueTodayTasks.forEach((task) => console.log(task.displayableString()));
      console.log("\n");

      console.log("Due Later");
      const dueLaterTasks = await Todo.dueLater();
      dueLaterTasks.forEach((task) => console.log(task.displayableString()));
    }

    static async overdue() {
      return await Todo.findAll({
        where: { dueDate: { [Sequelize.Op.lt]: new Date() } },
        order: [["dueDate", "ASC"]],
      });
    }

    static async dueToday() {
      return await Todo.findAll({
        where: {
          completed: false,
          dueDate: {
            [Sequelize.Op.between]: [
              new Date().setHours(0, 0, 0, 0),
              new Date().setHours(23, 59, 59, 999),
            ],
          },
        },
        order: [["dueDate", "ASC"]],
      });
    }

    static async dueLater() {
      return await Todo.findAll({
        where: {
          completed: false,
          dueDate: { [Sequelize.Op.gt]: new Date().setHours(23, 59, 59, 999) },
        },
        order: [["dueDate", "ASC"]],
      });
    }

    static async markAsComplete(id) {
      const task = await Todo.findByPk(id);
      if (task) {
        task.completed = true;
        await task.save();
        console.log(`Task ${id} marked as complete`);
      } else {
        console.log(`Task ${id} not found`);
      }
    }

    displayableString() {
      const checkbox = this.completed ? "[x]" : "[ ]";
      const today = new Date().setHours(0, 0, 0, 0);
      const due = new Date(this.dueDate).setHours(0, 0, 0, 0);

      if (due === today) {
        return `${this.id}. ${checkbox} ${this.title}`;
      } else {
        return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
      }
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
    }
  );
  return Todo;
};
