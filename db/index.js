const Sequelize = require("sequelize");

const sequelize = new Sequelize("deminer", "root", "", {
   dialect: "mysql",
   host: "localhost",
});

const Users = require("./Users.js")(sequelize);

module.exports = {
   sequelize: sequelize,
   users: Users,
};
