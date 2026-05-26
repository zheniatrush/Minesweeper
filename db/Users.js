const Sequelize = require("sequelize");
const { sequelize } = require(".");

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
         role: {
            type: Sequelize.STRING(5),
         },
      },
      {
         tableName: "Users",
         timestamps: false,
      },
   );
};

const Lobby = sequelize.define("lobby", {
   lobby_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
   },
   lobby_name: {
      type: Sequelize.STRING(50),
      allowNull: false,
   },
   first_player: {
      type: Sequelize.STRING(25),
      allowNull: false,
   },
   second_player: {
      type: Sequelize.STRING(25),
      allowNull: false,
   },
   game_state: {
      type: Sequelize.STRING(20),
      allowNull: false,
   },
   first_player_json: {
      type: Sequelize.json,
      allowNull: false,
   },
   second_player_json: {
      type: Sequelize.json,
      allowNull: false,
   },
   winner: {
      type: Sequelize.STRING(50),
      allowNull: true,
   },
   counter_one: {
      type: Sequelize.INTEGER,
      allowNull: false,
   },
   counter_two: {
      type: Sequelize.INTEGER,
      allowNull: false,
   },
   timer_one: {
      type: Sequelize.time,
      allowNull: false,
   },
   timer_two: {
      type: Sequelize.time,
      allowNull: false,
   },
});
module.exports = Lobby;
