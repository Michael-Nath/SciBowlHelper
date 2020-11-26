'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Players', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      boCorrect: {
        type: Sequelize.INTEGER
      },
      boTotal: {
        type: Sequelize.INTEGER
      },
      tuCorrect: {
        type: Sequelize.INTEGER
      },
      tuTotal: {
        type: Sequelize.INTEGER
      },
      interCorrect: {
        type: Sequelize.INTEGER
      },
      interTotal: {
        type: Sequelize.INTEGER
      },
      avgBuzz: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Players');
  }
};