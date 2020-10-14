const Discord = require("discord.js");
const Game = require("../utils/game");
const games = new Discord.Collection();
//commands will be of structure return message.channel.send(game.function)

function isModerator(message) {
	return message.member.roles.cache.has("760208780485984306");
}

function start(message, args) {
	// at the start of every round, reset all variables to defaults
	if (!isModerator(message)) {
		return message.channel.send(
			"You must be a **moderator** to use this command."
		);
	}

	const gameCode = Math.trunc(10000 * Math.random());
	const modId = message.author.id;
	const newGame = new Game(gameCode);
	games.set(modId, newGame);

	// game has started. join through this code: fgsdkstfghret
	return message.channel.send(
		`GAME HAS STARTED. PLEASE JOIN THROUGH THIS CODE: ${gameCode}`
	);
}

function join(message, args) {
	if (isModerator(message)) {
		return message.channel.send(
			"You must be a **player** to use this command."
		);
	}
	const player = message.author.id;
	const gameid = args[1];
	games.set(
		player,
		games.find((game) => game.gameCode == gameid)
	);
	return message.channel.send("successfully joined");
}

function right(message, args, game) {
	if (!isModerator(message)) {
		return message.channel.send(
			"You must be a **moderator** to use this command."
		);
	}
	if (game) {
		return message.channel.send(game.right());
	} else {
		return message.channel.send("no game available");
	}
}

function leave(message, args, game) {
	if (!isModerator(message)) {
		return message.channel.send(
			"You must be a **moderator** to use this command."
		);
	}

	const id = message.author.id;
	if (!game) {
		return message.channel.send(
			"You must be a part of an existing game in order to leave one."
		);
	}

	games.delete(id);
	return message.channel.send("You have succesfully left the game.");
}

function stop(message, args, game) {
	if (!isModerator(message)) {
		return message.channel.send(
			"You must be a **moderator** to use this command."
		);
	}
	games.sweep((g) => g.gameCode == game.gameCode);
	return message.channel.send("Game Successfully Ended");
}

function inspect(message, args, game) {
	if (game) {
		return message.channel.send(JSON.stringify(game));
	}

	return message.channel.send("no game available");
}

function buzz(message, args, game) {
	if (game) {
		return message.channel.send(game.buzz(message));
	}
	return message.channel.send("You have to be in a game to buzz.");
}

function tossUp(message, args, game) {
	if (isModerator && game) {
		return message.channel.send(game.tossUp(message, args[1]));
	}
	return message.channel.send(
		"You cannot use that command right now. You must be both be a moderator and in an active game."
	);
}

function wrong(message, args, game) {
	if (isModerator && game) {
		return message.channel.send(game.wrong(message));
	}
	return message.channel.send(
		"You cannot use that command right now. You must be both a moderator and in an active game."
	);
}
function view(message, args, game) {
	return message.channel.send(game.view())
}

function roundEnd(message, args, game) {
	return message.channel.send(game.roundEnd(message))
}

module.exports = {
	name: "s",
	description: "Score Keeper and Match Assistant",
	cooldown: 1,
	args: true,
	execute(message, args) {
		// something to retreive specific game object
		const author = message.author.id;
		const game = games.get(author);
		switch (args[0]) {
			case "start":
				return start(message, args);
			case "stop":
				return stop(message, args, game);
			case "qend":
				return roundEnd(message, args);
			case "join":
				return join(message, args);
			case "v":
				return view(message, args, game);
			case "tu":
				return tossUp(message, args, game);
			case "bz":
				return buzz(message, args, game);
			case "r":
				return right(message, args, game);
			case "w":
				return wrong(message, args, game);
			case "bo":
				return bonus(message, args, game);
			case "add":
				return add(message, args);
			case "inspect":
				return inspect(message, args, game);
			case "leave":
				return leave(message, args, game);
		}
	},
};
