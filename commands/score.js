const Discord = require("discord.js");
const Game = new Discord.Collection();

module.exports = {
	name: "score",
	description: "simple scorekeeping",
	args: true,
	execute(message, args) {
		if (args[0] === "start") {
			Game.set("green", 0);
			Game.set("red", 0);
			return message.channel.send("A game has been started!");
		}
		if (args[0] === "stop") {
			if (Game.length === 0) {
				return message.channel.send(
					"A game session has not started not, silly!"
				);
			}
			const greenScore = Game.get("green");
			const redScore = Game.get("red");
			Game.delete("green");
			Game.delete("red");
			return message.channel.send(
				`Game has stopped.\n GREEN: ${greenScore} RED: ${redScore}`
			);
		}
	},
};
