import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Student from "./StudentModel.js";

const { DataTypes } = Sequelize;

const Schedule = db.define(
  "schedule",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    class: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true,
  }
);

Student.hasMany(Schedule);
Schedule.belongsTo(Student, { foreignKey: "studentId" });

export default Schedule;
