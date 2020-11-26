const { Player } = require("../models");

async function addPlayer(message) {
	const user = message.member;
	const id = user.id;
	const username = user.user.username;
	const nickname = user.displayName;
	const player = await Player.findOne({ where: { dsid: id } });
	if (!player) {
		await Player.create({
			dsid: id,
			username: username,
			boCorrect: 0,
			boTotal: 0,
			tuCorrect: 0,
			tuTotal: 0,
			interCorrect: 0,
			interTotal: 0,
			avgBuzz: 0.0,
			nickname: nickname,
		});
		return message.channel.send("You have been added to the club roster!");
	}
	return message.channel.send("This player is already in the database");

	// adds player to official club roster if not already there
}

async function getPlayers(message) {
	const all = await Player.findAll();
	all.map((player) => message.channel.send(player.nickname + "\n"));
	return message.channel.send("Done");
}

async function updateNickname(message) {
	const id = message.author.id;
	const player = await Player.findOne({ where: { dsid: id } });
	player.nickname = message.member.displayName;
	try {
		await player.save();
		return message.channel.send("Nickname updated");
	} catch (error) {
		console.error(error);
		return message.channel.send("Contact **Michael Nath**");
	}
}
module.exports = {
	name: "db",
	description: "Database Handler",
	cooldown: 1,
	args: true,
	execute(message, args) {
		switch (args[0]) {
			case "add":
				return addPlayer(message);
			case "get":
				return getPlayers(message);
			case "update":
				return updateNickname(message);
		}
	},
};
