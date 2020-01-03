var Sequelize = require("sequelize");
var passportLocalSequelize = require("passport-local-sequelize");

// ******* Postgres Connection ********
var sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
	host: process.env.PGHOST,
	dialect: "postgres",
	port: process.env.PGPORT,
	pool: {
	 max: 5,
	 min: 0,
	 idle: 10000
 }
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

// ******* Postgres Model ********
var User = sequelize.define("user", {
	username: Sequelize.STRING,
	myhash: Sequelize.TEXT,
	mysalt: Sequelize.STRING
});

// Activate passport-local-sequelize
passportLocalSequelize.attachToUser(User, {
    usernameField: 'username',
    hashField: 'myhash',
    saltField: 'mysalt'
});

// Create table in database if not exists
sequelize.sync();


module.exports = User;