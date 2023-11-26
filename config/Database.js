import { Sequelize } from "sequelize";

const db = new Sequelize("db_scheduling", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
