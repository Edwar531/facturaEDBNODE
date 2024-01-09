import { Sequelize } from "sequelize";
const dbname: any = process.env.DB_NAME;
const dbuser: any = process.env.DB_USER;
const dbpass: any = process.env.DB_PASS;
const dbhost: any = process.env.DB_HOST;
const dbport: any = process.env.DB_PORT;


const db = new Sequelize(dbname, dbuser, dbpass, {
  port: dbport,
  host: dbhost,
  dialect: "mysql",
  define: {
    underscored: true,
  },
  logging: false,
});

export default db;
