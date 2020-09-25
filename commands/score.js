const Discord = require("discord.js");
const Game = new Discord.Collection();
var Toss = false;
var Bonus = false;
var Interrupt = false;
var buffer = 0;
var currentlyBuzzing = false;
var currentBuzzingTeam = "";
var interruptingTeam = "";
let tossUpTimeout;
let bonusTimeout;
var currentGreenGain = 0;
var currentRedGain = 0;
var wrongs = [];
function addZero(x, n) {
	while (x.toString().length < n) {
		x = "0" + x;
	}
	return x;
}

function myFunction() {
	var d = new Date();

	var h = addZero(d.getHours(), 2);
	var m = addZero(d.getMinutes(), 2);
	var s = addZero(d.getSeconds(), 2);
	var ms = addZero(d.getMilliseconds(), 3);
	return h + ":" + m + ":" + s + ":" + ms;
}
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
	Toss = false;
	Bonus = false;
	Interrupt = false;
	currentlyBuzzing = false;
	currentBuzzingTeam = "";
	currentGreenGain = 0;
	currentRedGain = 0;
	return message.channel.send(
		`Game has stopped.\n GREEN: ${greenScore} RED: ${redScore}`
	);
};

const roundEnd = (message, args) => {
	try {
		if (Interrupt) {
			if (currentBuzzingTeam === "green") currentRedGain += 4;
			else if (currentBuzzingTeam === "red") currentGreenGain += 4;
			Interrupt = false;
		}
		Game.set("g", Game.get("g") + currentGreenGain);
		Game.set("r", Game.get("r") + currentRedGain);
		const greenScore = Game.get("g");
		const redScore = Game.get("r");
		Toss = false;
		Bonus = false;
		currentlyBuzzing = false;
		currentBuzzingTeam = "";
		message.client.clearTimeout();
		currentGreenGain = 0;
		currentRedGain = 0;

		return message.channel.send(
			`Mini rounded has ended!\nGREEN: ${greenScore} RED: ${redScore}`
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
	tossUpTimeout = message.client.setTimeout(() => {
		Toss = false;
		message.channel.send("Toss Up Over!");
		buffer = 0;
	}, 5000 + 1000 * buffer);
};

const buzz = (message, args) => {
	message.reply(myFunction())
	const currentUserDisplayName = message.member.displayName
		.split(" ")[0]
		.toLowerCase();
	if (Bonus) {
		return;
	}
	console.log(currentlyBuzzing);
	console.log(currentBuzzingTeam);
	if (
		currentlyBuzzing ||
		currentUserDisplayName === currentBuzzingTeam ||
		currentUserDisplayName === interruptingTeam
	) {
		return;
	} else {
		currentBuzzingTeam = message.member.displayName.split(" ")[0].toLowerCase();
		currentlyBuzzing = true;
		console.log(`Current team that's buzzing is`);
	}
	message.client.clearTimeout(tossUpTimeout);
	if (!Toss) {
		if (Bonus) {
			return message.reply("You may not buzz during a bonus round!");
		}
		Interrupt = true;
		interruptingTeam = currentBuzzingTeam;
		currentlyBuzzing = true;
		return message.reply(
			`You have buzzed before the toss up question could end. State your answer.`
		);
	}
	return message.reply(`State your answer.`);
};

const right = (message, args, buffer) => {
	if (Toss || Interrupt) {
		message.client.clearTimeout(tossUpTimeout);
		Toss = false;
		Interrupt = false;
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
		message.client.clearTimeout(bonusTimeout);
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
		return roundEnd(message, args);
	}
};

const wrong = (message, args) => {
	if (Interrupt) {
		currentlyBuzzing = false;
		if (currentBuzzingTeam === "green") {
			currentRedGain += 4;
		} else if (currentBuzzingTeam === "red") {
			currentGreenGain += 4;
		}
		return message.channel.send("Wrong! Toss up will be repeated.");
	}
	if (Toss) {
		message.client.clearTimeout(tossUpTimeout);
		if (!wrongs.includes(currentBuzzingTeam)) {
			wrongs.push(currentBuzzingTeam);
		}
		currentlyBuzzing = false;
		buffer = 0.2;
		if (wrongs.length == 2) {
			wrongs = [];
			return roundEnd(message, args);
		}
		const opposingTeam = currentBuzzingTeam === "green" ? "red" : "green";
		return message.channel.send(`${opposingTeam} team may now buzz.`);
	} else if (Bonus) {
		message.client.clearTimeout(bonusTimeout);
		return roundEnd(message, args);
	}
};

const bonus = (message, args) => {
	Bonus = true;
	message.channel.send("Bonus round has just begun.");
	bonusTimeout = setTimeout(() => {
		message.channel.send("Bonus round is over!");
		return roundEnd(message, args);
	}, 20000);
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
			case "bo":
				return bonus(message, args);
		}
	},
};
