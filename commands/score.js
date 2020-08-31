const Discord = require("discord.js");
const Game = new Discord.Collection();
var Toss = false;
var Bonus = false;
var Interrupt = false;
var currentlyBuzzing = false;
var currentBuzzingTeam = "";
let clientTimeout;
var currentGreenGain = 0;
var currentRedGain = 0;

const start = (message, args) => {
	if (Game.get("r") != undefined || Game.get("g") != undefined) {
		return message.channel.send(
			"Can't start a game without stopping the current one!"
		);
	}
	Game.set("g", 0);
	Game.set("r", 0);
	return message.channel.send("A game has been started!");
};

const stop = (message, args) => {
	if (Game.length === 0) {
		return message.channel.send("A game session has not started not, silly!");
	}
	const greenScore = Game.get("g");
	const redScore = Game.get("r");
	Game.delete("g");
	Game.delete("r");
	return message.channel.send(
		`Game has stopped.\n GREEN: ${greenScore} RED: ${redScore}`
	);
};

const roundEnd = (message, args) => {
	try {
		if (Interrupt) {
			if (currentBuzzingTeam === "green") currentRedGain += 4;
			else if (currentBuzzingTeam === "red") currentGreenGain += 4;
		}
		Game.set("g", Game.get("g") + currentGreenGain);
		Game.set("r", Game.get("r") + currentRedGain);
		const greenScore = Game.get("g");
		const redScore = Game.get("r");
		Toss = false;
		Bonus = false;
		currentlyBuzzing = false;
		message.client.clearTimeout();
		currentGreenGain = 0;
		currentRedGain = 0;

		return message.channel.send(
			`Points have been successfuly awarded!\nGREEN: ${greenScore} RED: ${redScore}`
		);
	} catch (error) {
		console.log(error);
		return message.channel.send("An error has occured!");
	}
};

const view = (message, args) => {
	const greenScore = Game.get("g");
	const redScore = Game.get("r");
	return message.channel.send(`GREEN: ${greenScore} RED: ${redScore}`);
};

const tossUp = (message, args) => {
	message.channel.send("Toss Up has Started.");
	Toss = true;
	currentBuzzingTeam = "";
	clientTimeout = message.client.setTimeout(() => {
		Toss = false;
		message.channel.send("Toss Up Over!");
	}, 5000);
};

const buzz = (message, args) => {
	const currentUserDisplayName = message.member.displayName
		.split(" ")[0]
		.toLowerCase();
	if (Bonus) return;
	if (currentlyBuzzing || currentUserDisplayName === currentBuzzingTeam) {
		return;
	} else {
		currentBuzzingTeam = message.member.displayName.split(" ")[0].toLowerCase();
		currentlyBuzzing = true;
		console.log(`Current team that's buzzing is ${currentBuzzingTeam}`);
	}
	message.client.clearTimeout(clientTimeout);
	if (!Toss) {
		if (Bonus) {
			return message.reply("You may not buzz during a bonus round!");
		}
		Interrupt = true;
		currentlyBuzzing = true;
		return message.reply(
			"You have buzzed before the toss up question could end. State your answer."
		);
	}
	return message.reply("State your answer.");
};

const right = (message, args) => {
	if (Toss) {
		Toss = false;
		if (currentBuzzingTeam === "green") {
			currentGreenGain += 4;
		} else if (currentBuzzingTeam === "red") {
			currentRedGain += 4;
		} else {
			return message.channel.send(
				"Oops there appears to be an error. Contact **Michael Nath**"
			);
		}
		return message.channel.send("Moving onto bonus round!");
	} else if (Bonus) {
		Bonus = false;
		if (currentBuzzingTeam === "green") {
			currentGreenGain += 10;
		} else if (currentBuzzingTeam === "red") {
			currentRedGain += 10;
		} else {
			return message.channel.send(
				"Oops there appears to be an error. Contact **Michael Nath**"
			);
		}
	}
};

const wrong = (message, args) => {
	if (Toss) {
		const opposingTeam = currentBuzzingTeam === "green" ? "red" : "green";
		currentBuzzingTeam = opposingTeam;
		currentlyBuzzing = false;
		clientTimeout = message.client.setTimeout(() => {
			Toss = false;
			message.channel.send("Toss Up Over!");
		}, 5000);
		return message.channel.send(`${opposingTeam} team may now buzz.`);
	} else if (Bonus || Interrupt) {
		return roundEnd(message, end);
	}
};
module.exports = {
	name: "score",
	description: "simple scorekeeping",
	cooldown: 1,
	args: true,
	execute(message, args) {
		switch (args[0]) {
			case "start":
				return start(message, args);
			case "stop":
				return stop(message, args);
			case "round-end":
				return roundEnd(message, args);
			case "view":
				return view(message, args);
			case "tu":
				return tossUp(message, args);
			case "buzz":
				return buzz(message, args);
			case "right":
				return right(message, args);
			case "wrong":
				return wrong(message, args);
		}
	},
};
