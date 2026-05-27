const Sequelize = require("sequelize");

module.exports = function (sequelize) {
   return sequelize.define("lobby", {
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
         type: Sequelize.JSON,
         allowNull: false,
      },
      second_player_json: {
         type: Sequelize.JSON,
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
         type: Sequelize.TIME,
         allowNull: false,
      },
      timer_two: {
         type: Sequelize.TIME,
         allowNull: false,
      },
      player_count: {
         type: Sequelize.INTEGER,
         allowNull: false,
      },
   });
};
