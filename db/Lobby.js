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
         allowNull: true,
      },
      first_player: {
         type: Sequelize.STRING(25),
         allowNull: true,
      },
      second_player: {
         type: Sequelize.STRING(25),
         allowNull: true,
      },
      game_state: {
         type: Sequelize.STRING(20),
         allowNull: true,
      },
      first_player_json: {
         type: Sequelize.JSON,
         allowNull: true,
      },
      second_player_json: {
         type: Sequelize.JSON,
         allowNull: true,
      },
      winner: {
         type: Sequelize.STRING(50),
         allowNull: true,
      },
      counter_one: {
         type: Sequelize.INTEGER,
         allowNull: true,
      },
      counter_two: {
         type: Sequelize.INTEGER,
         allowNull: true,
      },
      timer_one: {
         type: Sequelize.TIME,
         allowNull: true,
      },
      timer_two: {
         type: Sequelize.TIME,
         allowNull: true,
      },
      player_count: {
         type: Sequelize.INTEGER,
         allowNull: true,
      },
   });
};
