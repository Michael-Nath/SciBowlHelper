const Discord = require("discord.js");
const Game = require("../utils/game");
const games = new Discord.Collection();
//commands will be of structure return message.channel.send(game.function)

function start(message, args) {
	// at the start of every round, reset all variables to defaults
	if (!message.member.roles.cache.find((r) => r.name === "Moderator")) {
		return message.channel.send(
			"You must be a **moderator** to use this command."
		);
	}

	const gameCode = Math.trunc(100000 * Math.random());
	const modId = message.author.id;
	const newGame = new Game(gameCode);
	games.set(modId, newGame);

	// game has started. join through this code: fgsdkstfghret
	return message.channel.send(
		`GAME HAS STARTED. PLEASE JOIN THROUGH THIS CODE: ${gameCode}`
	);
}

function inspect(message, args) {
	if (!message.member.roles.cache.find((r) => r.name === "Moderator")) {
		return message.channel.send(
			"You must be a **moderator** to use this command."
		);
	}
	const modId = message.author.id;
	return message.channel.send(JSON.stringify(games.get(modId)));
}

function stop(message, args) {
	if (!message.member.roles.cache.find((r) => r.name === "Moderator")) {
		return message.channel.send(
			"You must be a **moderator** to use this command."
		);
	}
	message.client.clearTimeout(buzzerTimeout);
	message.client.clearTimeout(warningTimeout);
	resetVariables(message, args);
	greenPoints = 0;
	redPoints = 0;
	qNum = 0;
	return message.channel.send(
		"Game has ended. Please start it again if you'd like to keep playing."
	);
}

module.exports = {
	name: "s",
	description: "Score Keeper and Match Assistant",
	cooldown: 1,
	args: true,
	execute(message, args) {
		// something to retreive specific game object
		switch (args[0]) {
			case "start":
				return start(message, args);
			case "stop":
				return stop(message, args);
			case "qend":
				return roundEnd(message, args);
			case "v":
				return view(message, args);
			case "tu":
				return tossUp(message, args);
			case "bz":
				return buzz(message, args);
			case "r":
				return right(message, args);
			case "w":
				return wrong(message, args);
			case "bo":
				return bonus(message, args);
			case "add":
				return add(message, args);
			case "inspect":
				return inspect(message, args);
		}
	},
};
