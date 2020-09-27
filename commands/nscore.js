var greenPoints = 0;
var redPoints = 0;
let bonusRound;
let tossRound;
let buzzerTimeout;
let currentBuzzing;
function resetVariables() {
	tossRound = false;
	bonusRound = false;
	currentBuzzing = "";
	buzzerTimeout = null;
}

function start(message, args) {
	// at the start of every round, reset all variables to defaults
	resetVariables();
	return message.channel.send("Game has started");
}

function view(message, args) {
	return message.channel.send(`Green: ${greenPoints} Red: ${redPoints}`);
}

function roundEnd(message, args) {
	// reset all variables to defaults
	resetVariables();
	return message.channel.send("Round has just ended.");
}

function tossUp(message, args) {
	tossRound = true;
	// after 5 seconds, toss up round should end
	buzzerTimeout = message.client.setTimeout(() => {
		message.channel.send("Toss up is over!");
		toss = false;
	}, 5000);
	return message.channel.send("Toss up has started!");
}

function bonus(message, args) {
	bonusRound = true;
}

function buzz(message, args) {
	// if a toss up round hasn't started, return an error message
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
	message.client.clearTimeout(buzzerTimeout);
	displayName = message.member.displayName;
	currentBuzzing = displayName.split(" ")[0].toLowerCase();
	return message.channel.send(`**${displayName}**, please state your answer.`);
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
	} else if (args[1] == "b") {
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
	if (tossRound) {
		// switches the team that's now buzzing
		if (currentBuzzing == "green") {
			currentBuzzing = "red";
		} else if (currentBuzzing == "red") {
			currentBuzzing = "green";
		} else {
			return message.channel.send("Contact **Michael Nath**");
		}
		message.channel.send("Opposing team, get ready...");
		// effectively gives people three seconds to get ready to buzz.
		let i = 2;
		bufferTimeout = message.client.setInterval(() => {
			if (i != 0) {
				message.channel.send(i);
			} else {
				message.client.clearTimeout(bufferTimeout);
				message.channel.send("You may buzz now!");
			}
			i -= 1;
		}, 1000);
		// after three seconds are over, the other team will oficially have 5 seconds to buzz in.
		buzzerTimeout = message.client.setTimeout(() => {
			message.channel.send("Toss up is over!");
			toss = false;
		}, 8050);
		return buzzerTimeout;
	}

	if (bonusRound) {
		return message.channel.send("Wait for moderator to end round.");
	}
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
