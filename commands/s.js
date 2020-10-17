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
	const game = games.find((game) => game.gameCode == gameid);
	if (game) {
		games.set(player, game);
		return message.channel.send("successfully joined");
	}
	return message.channel.send("there is no game with that code");
}

function right(message, args, game) {
	if (!isModerator(message)) {
		return message.channel.send(
			"You must be a **moderator** to use this command."
		);
	}
	if (game) {
		return message.channel.send(game.right(message));
	} else {
		return message.channel.send("no game available");
	}
}

function leave(message, args, game) {
	if (isModerator(message)) {
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
	if (game) {
		return message.channel.send(game.view());
	} else {
		return message.channel.send("There is no game");
	}
}

function roundEnd(message, args, game) {
	if (!isModerator(message)) {
		return message.channel.send(
			"You must be a **moderator** to use this command."
		);
	}
	if (game) {
		return message.channel.send(game.roundEnd(message));
	} else {
		return message.channel.send("There is no game");
	}
}

function players(message, args, game) {
	if (!game) {
		return message.channel.send("You are not part of a game!");
	}
	message.channel.send(`Here are the players for game ${game.gameCode}:`);
	players = games
		.filter((g) => g.gameCode == game.gameCode)
		.map((value, key) =>
			message.channel.send(message.guild.members.cache.get(key).user.username)
		);

	return message.channel.send("Done");
}
function add(message, args, game) {
	if (!isModerator(message)) {
		return message.channel.send(
			"You must be a **moderator** to use this command."
		);
	}
	if (game) {
		let team = args[1];
		let points = args[2];
		if (team != "g" && team != "r") {
			return message.channel.send(
				'Points need to be added to either red team "r" or green team "g"'
			);
		}
		try {
			return message.channel.send(add(parseInt(points), team));
		} catch (error) {
			return message.channel.send(
				"You need to add an integer number of points"
			);
		}
	} else {
		return message.channel.send("There is no game");
	}
}

function bonus(message, args, game) {
	if (!isModerator(message)) {
		return message.channel.send(
			"You must be a **moderator** to use this command."
		);
	}

	if (game) {
		return message.channel.send(game.bonus(message));
	}
	return message.channel.send("You are not part of a game");
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
			case "start": // check
				return start(message, args);
			case "stop": // check
				return stop(message, args, game);
			case "qend": //check
				return roundEnd(message, args, game);
			case "join": //check
				return join(message, args);
			case "v": //check
				return view(message, args, game);
			case "tu": // check
				return tossUp(message, args, game);
			case "bz": // check
				return buzz(message, args, game);
			case "r": // check
				return right(message, args, game);
			case "w": // check
				return wrong(message, args, game);
			case "bo": // check
				return bonus(message, args, game);
			case "add": // check
				return add(message, args, game);
			case "inspect": // check
				return inspect(message, args, game);
			case "leave": // check
				return leave(message, args, game);
			case "players": // check
				return players(message, args, game);
		}
	},
};
