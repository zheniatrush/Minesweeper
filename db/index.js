const Sequelize = require("sequelize");

const sequelize = new Sequelize("deminer", "root", "", {
   dialect: "mysql",
   host: "localhost",
});

const Users = require("./Users.js")(sequelize);
const Lobby = require("./Lobby.js")(sequelize);

module.exports = {
   sequelize,
   Users,
   Lobby,
};
sequelize.sync();
