const { green } = require("@material-ui/core/colors");

var greenPoints = 0;
var redPoints = 0;
let bonusRound;
let tossRound;
let buzzerTimeout;
let currentBuzzing;
let answerWrong;
let attempts;
let question;
let interrupt;
function resetVariables() {
	// various types of rounds
	tossRound = false;
	interrupt = false;
	bonusRound = false;

	// the team that's currently buzzing
	currentBuzzing = "";
	buzzerTimeout = null;
	answerWrong = false;
	attempts = 0;
	question = false;
	
}

function start(message, args) {
	// at the start of every round, reset all variables to defaults
	resetVariables();
	return message.channel.send("Game has started");
}

function tossUp(message, args) {
	if (args[1] == "q") {
		tossRound = true;
		return message.channel.send("Toss Up question is now being read.");
	} else if (args[1] == "t") {
		buzzerTimeout = message.client.setTimeout(() => {
			message.channel.send("Toss up is over!");
			tossRound = false;
		}, 5000);
		return message.channel.send("Toss up has started!");
	}
	tossRound = true;
	// after 5 seconds, toss up round should end
}

function buzz(message, args) {
	// if a toss up round hasn't started, return an error message

	// if a team is wrong, its players should not be able to buzz
	if (
		answerWrong &&
		message.member.displayName.split(" ")[0].toLowerCase() != currentBuzzing
	) {
		answerWrong = false;
		return message.channel.send("Your team can't buzz now.");
	}
	// if someone buzzes without there being a toss up round, cancel their buzz
	if (!tossRound) {
		return message.channel.send("Error: Tossup round hasn't started yet.");
	}
	// if someone has already buzzed, no one else should be buzzing.
	if (currentBuzzing) {
		return message.channel.send(
			"Error: Cannot buzz while someone else is buzzing."
		);
	}
	// if someone buzzes, then the 5 second timer is stopped.
	displayName = message.member.displayName;
	currentBuzzing = displayName.split(" ")[0].toLowerCase();
	message.client.clearTimeout(buzzerTimeout);
	return message.channel.send(`**${displayName}**, please state your answer.`);
}

function bonus(message, args) {
	bonusRound = true;
	buzzerTimeout = message.client.setTimeout(() => {
		message.channel.send("Bonus round is over!");
		bonusRound = false;
	}, 20000);
}

function right(message, args) {
	if (tossRound) {
		tossRound = false;
		if (currentBuzzing == "green") {
			greenPoints += 4;
		} else if (currentBuzzing == "red") {
			redPoints += 4;
		} else {
			return message.channel.send("Contact **Michael Nath**");
		}
	} else if (bonusRound) {
		bonusRound = false;
		if (currentBuzzing == "green") {
			greenPoints += 10;
		} else if (currentBuzzing == "red") {
			redPoints += 10;
		} else {
			return message.channel.send("Contact **Michael Nath**");
		}
	}
	return message.channel.send("Points have successfully been added.");
}

function wrong(message, args) {
	answerWrong = true;
	if (attempts == 1) {
		return roundEnd(message, args);
	}
	if (tossRound) {
		attempts += 1;
		// switches the team that's now buzzing
		console.log("Switching should be happening rn");
		if (currentBuzzing == "green") {
			currentBuzzing = "red";
		} else if (currentBuzzing == "red") {
			currentBuzzing = "green";
		} else {
			return message.channel.send("Contact **Michael Nath**");
		}
		message.channel.send("Opposing team, you may buzz now...");
		// effectively gives people three seconds to get ready to buzz.
		// let i = 2;
		// bufferTimeout = message.client.setInterval(() => {
		// 	if (i != 0) {
		// 		message.channel.send(i);
		// 	} else {
		// 		message.client.clearTimeout(bufferTimeout);
		// 		message.channel.send("You may buzz now!");
		// 	}
		// 	i -= 1;
		// }, 1000);
		// after three seconds are over, the other team will oficially have 5 seconds to buzz in.
		buzzerTimeout = message.client.setTimeout(() => {
			message.channel.send("Toss up is over!");
			tossRound = false;
		}, 6000);
		return buzzerTimeout;
	}

	if (bonusRound) {
		return message.channel.send("Wait for moderator to end round.");
	}
}

function view(message, args) {
	return message.channel.send(`Green: ${greenPoints} Red: ${redPoints}`);
}

function roundEnd(message, args) {
	// reset all variables to defaults
	resetVariables();
	return message.channel.send("Round has just ended.");
}

module.exports = {
	name: "nscore",
	description: "new scorekeeping",
	cooldown: 1,
	args: true,
	execute(message, args) {
		switch (args[0]) {
			case "start":
				return start(message, args);
			// case "stop":
			// 	return stop(message, args);
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
