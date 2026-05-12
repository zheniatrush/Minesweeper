const Sequelize = require("sequelize");

module.exports = function (sequelize) {
   return sequelize.define(
      "users",
      {
         login: {
            type: Sequelize.STRING(25),
            primaryKey: true,
         },
         password: {
            type: Sequelize.STRING(255),
         },
         email: {
            type: Sequelize.STRING(50),
         },
      },
      {
         tableName: "Users",
         timestamps: false,
      },
   );
};
