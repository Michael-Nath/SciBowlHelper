'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Player.init({
    boCorrect: DataTypes.INTEGER,
    boTotal: DataTypes.INTEGER,
    tuCorrect: DataTypes.INTEGER,
    tuTotal: DataTypes.INTEGER,
    interCorrect: DataTypes.INTEGER,
    interTotal: DataTypes.INTEGER,
    avgBuzz: DataTypes.FLOAT,
    username: DataTypes.STRING,
    nickname: DataTypes.STRING,
    dsid: DataTypes.STRING 
  }, {
    sequelize,
    modelName: 'Player',
  });
  return Player;
};