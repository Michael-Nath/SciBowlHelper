const Discord = require("discord.js");
const Game = new Discord.Collection();

module.exports = {
	name: "score",
	description: "simple scorekeeping",
	args: true,
	execute(message, args) {
		if (args[0] === "start") {
			Game.set("g", 0);
			Game.set("r", 0);
			return message.channel.send("A game has been started!");
		} else if (args[0] === "stop") {
			if (Game.length === 0) {
				return message.channel.send(
					"A game session has not started not, silly!"
				);
			}
			const greenScore = Game.get("g");
			const redScore = Game.get("r");
			Game.delete("g");
			Game.delete("r");
			return message.channel.send(
				`Game has stopped.\n GREEN: ${greenScore} RED: ${redScore}`
			);
		} else if (args[0] === "add") {
			if (args.length != 3) {
				return message.channel.send(
					"You have not provided the appropriate number of arguments. Please input `!help score` for guidance."
				);
			}
			if (!["r", "g"].includes(args[1])) {
				return message.channel.send(
					"You have not indicated which team is getting the points!"
				);
			}
			try {
				Game.set(args[1], Game.get(args[1]) + parseInt(args[2]));
				const greenScore = Game.get("g");
				const redScore = Game.get("r");
				return message.channel.send(
					`Points have been successfuly awarded!\nGREEN: ${greenScore} RED: ${redScore}`
				);
			} catch (error) {
				console.log(error);
				return message.channel.send("An error has occured!");
			}
		} else if (args[0] === "view") {
			const greenScore = Game.get("g");
			const redScore = Game.get("r");
			return message.channel.send(`GREEN: ${greenScore} RED: ${redScore}`);
		}
	},
};
