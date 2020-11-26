"use strict";
const now = new Date();
module.exports = {
	up: async (queryInterface, Sequelize) => {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
		await queryInterface.bulkInsert("Players", [
			{
				username: "bob123",
				nickname: "Bob",
				dsid: "318347178634",
				boCorrect: 34,
				boTotal: 50,
				tuCorrect: 56,
				tuTotal: 87,
				interCorrect: 21,
				interTotal: 30,
				avgBuzz: 2.3,
				createdAt: now,
				updatedAt: now,
			},
		]);
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete("Player", {
			dsid: "318347178634",
		});
	},
};
