var greenPoints = 0;
var redPoints = 0;
var qNum = 1;
let bonusRound;
let tossRound;
let buzzerTimeout;
let currentBuzzing;
let answerWrong;
let attempts;
let question;
let interrupt;
let buzzedAlready;
function resetVariables() {
	// various types of rounds
	tossRound = false;
	interrupt = false;
	bonusRound = false;

	// the team that's currently buzzing
	currentBuzzing = "";
	// a future timeout object that will serve as buzzer timer
	buzzerTimeout = null;
	// needed to handle wrong logic
	answerWrong = false;
	// if attempts == 1 -> both teams got question wrong and round ends
	attempts = 0;
	question = false;
	buzzedAlready = false;
}

function start(message, args) {
	// at the start of every round, reset all variables to defaults
	if (!message.member.roles.cache.find((r) => r.name === "Moderator")) {
		return message.channel.send(
			"You must be a **moderator** to use this command."
		);
	}
	resetVariables();
	return message.channel.send("GAME HAS STARTED.\n————QUESTION 1————");
}

function tossUp(message, args) {
	if (!message.member.roles.cache.find((r) => r.name === "Moderator")) {
		return message.channel.send(
			"You must be a **moderator** to use this command."
		);
	}
	if (args[1] == "q") {
		tossRound = true;
		question = true;
		return message.channel.send("Toss Up question is now being read.");
	} else if (args[1] == "t") {
		question = false;
		// after 5 seconds, toss up round should end
		buzzerTimeout = message.client.setTimeout(() => {
			message.channel.send("Toss up is over!");
			return view(message, args);
			tossRound = false;
		}, 5000);
		return message.channel.send("Toss up question has finished being read!");
	} else {
		return message.channel.send(
			"Please provide either `t` or `q` arg to `!nscore tu`"
		);
	}
}

function buzz(message, args) {
	// if a team is wrong, its players should not be able to buzz
	if (message.member.roles.cache.find((r) => r.name === "Moderator")) {
		return message.channel.send("You must be a **player** to buzz.");
	}
	if (
		answerWrong &&
		message.member.displayName.split(" ")[0].toLowerCase() != currentBuzzing
	) {
		return message.channel.send("Your team can't buzz now.");
	}
	// if someone buzzes without there being a toss up round, cancel their buzz
	if (!tossRound) {
		return message.channel.send("Error: Tossup round hasn't started yet.");
	}
	// if someone has already buzzed, no one else should be buzzing.
	if (currentBuzzing && buzzedAlready) {
		return message.channel.send(
			"Error: Cannot buzz while someone else is buzzing."
		);
	}
	// if someone buzzes, then the 5 second timer is stopped.
	userName = message.member.user.username;
	if (message.member.roles.cache.find((r) => r.name === "Green")) {
		currentBuzzing = "green";
	} else currentBuzzing = "red";
	buzzedAlready = true;
	message.client.clearTimeout(buzzerTimeout);
	if (question) {
		message.channel.send("**INTERRUPT**");
		interrupt = true;
	}
	return message.channel.send(`**${userName}**, please state your answer.`);
}

function bonus(message, args) {
	bonusRound = true;
	buzzerTimeout = message.client.setTimeout(() => {
		message.channel.send("**BONUS ROUND IS OVER.**");
		return roundEnd(message, args);
	}, 20000);

	message.client.setTimeout(() => {
		message.channel.send("**5 SECONDS LEFT...**");
	}, 15000);
	return message.channel.send(
		"**BONUS ROUND HAS STARTED. YOU HAVE 20 SECONDS.**"
	);
}

function right(message, args) {
	if (!message.member.roles.cache.find((r) => r.name === "Moderator")) {
		return message.channel.send(
			"You must be a **moderator** to use this command."
		);
	}
	if (tossRound) {
		tossRound = false;
		awardPoints(currentBuzzing, 4, message);
	} else if (bonusRound) {
		bonusRound = false;
		awardPoints(currentBuzzing, 10, message);
	}
	view(message, args);
	return message.channel.send("Points have successfully been added.");
}

function wrong(message, args) {
	answerWrong = true;
	if (currentBuzzing == "green") {
		currentBuzzing = "red";
	} else if (currentBuzzing == "red") {
		currentBuzzing = "green";
	} else {
		return message.channel.send("Contact **Michael Nath**");
	}
	if (attempts == 1) {
		if (interrupt) {
			awardPoints(currentBuzzing, 4, message);
		}
		view(message, args);
		return roundEnd(message, args);
	}
	if (tossRound) {
		attempts += 1;
		// switches the team that's now buzzing
		buzzedAlready = false;
		if (interrupt) {
			awardPoints(currentBuzzing, 4, message);
			view(message, args);
			return message.channel.send(
				"Opposing team, wait for mod to reread question."
			);
		} else {
			message.channel.send("Opposing team, you may buzz now...");
			buzzerTimeout = message.client.setTimeout(() => {
				message.channel.send("Toss up is over!");
				view(message, args);
				tossRound = false;
			}, 6000);
		}
		return buzzerTimeout;
	}

	if (bonusRound) {
		view(message, args);
		return message.channel.send("Wait for moderator to end round.");
	}
}

function view(message, args) {
	return message.channel.send(`Green: ${greenPoints} Red: ${redPoints}`);
}

function awardPoints(team, amnt, message) {
	if (team == "green") {
		greenPoints += amnt;
	} else if (team == "red") {
		redPoints += amnt;
	} else return message.channel.send("**ERROR**. Contact **Michael Nath**");
}

function roundEnd(message, args) {
	// reset all variables to defaults
	message.client.clearTimeout(buzzerTimeout);
	resetVariables();
	return message.channel.send(
		`**QUESTION ${qNum} HAS JUST ENDED.\n————QUESTION ${++qNum}————**`
	);
}

module.exports = {
	name: "s",
	description: "Score Keeper and Match Assistant",
	cooldown: 1,
	args: true,
	execute(message, args) {
		switch (args[0]) {
			case "start":
				return start(message, args);
			// case "stop":
			// 	return stop(message, args);
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
		}
	},
};
