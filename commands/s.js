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

	const gameCode = Math.trunc(1000000 * Math.random());
	const modId = message.author.id;
	const newGame = new Game(gameCode);
	games.set(modId, newGame);

	// game has started. join through this code: fgsdkstfghret
	return message.channel.send(
		`GAME HAS STARTED. PLEASE JOIN THROUGH THIS CODE: ${gameCode}`
	);
}

function join(message, args) {
	if (message.member.roles.cache.find((r) => r.name === "Moderator")) {
		return message.channel.send(
			"You must be a **player** to use this command."
		);
	}
	const player = message.author.id;
	const gameid = args[1];
	games.set(player, games.find(game => game.gameCode == gameid))
	return message.channel.send('successfully joined');
}

function leave(message, args) {
	if (message.member.roles.cache.find((r) => r.name === "Moderator")) {
		return message.channel.send(
			"You must be a **player** to use this command."
		);
	}
	const id = message.author.id;
	games.delete(id);
	return message.channel.send("successfully left");
}

function stop(message, args) {
	if (!message.member.roles.cache.find((r) => r.name === "Moderator")) {
		return message.channel.send(
			"You must be a **moderator** to use this command."
		);
	}

	const modId = message.author.id;
	const game = games.get(modId);
	games.sweep(g => g.gameCode == game.gameCode);
	return message.channel.send("successfully deleted");

}

function inspect(message, args) {
	const id = message.author.id;
	if (games.get(id)) {
		return message.channel.send(JSON.stringify(games.get(id)));
	}
	return message.channel.send("no game available");
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
			case 'join':
				return join(message, args);
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
