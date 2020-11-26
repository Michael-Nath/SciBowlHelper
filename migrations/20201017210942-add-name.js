"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
		 */
		await queryInterface.addColumn("Players", "nickname", Sequelize.STRING);
		await queryInterface.addColumn("Players", "username", Sequelize.STRING);
		await queryInterface.addColumn("Players", "dsid", Sequelize.STRING);
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
		await queryInterface.removeColumn("Players", "nickname");
		await queryInterface.removeColumn("Players", "username");
		await queryInterface.removeColumn("Players", "dsid");
	},
};
