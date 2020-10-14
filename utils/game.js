const Discord = require("discord.js");
class Game {
	resetVariables() {
		// various types of rounds
		this.tossRound = false;
		this.interrupt = false;
		this.bonusRound = false;

		// the team that's currently buzzing
		this.currentBuzzing = "";
		// a future timeout object that will serve as buzzer timer
		this.buzzerTimeout = null;
		// a future timeout object that will serve as bonus warning timer

		this.warningTimeout = null;
		// needed to handle wrong logic
		this.answerWrong = false;
		// if attempts == 1 -> both teams got question wrong and round ends
		this.attempts = 0;
		this.question = false;
		this.buzzedAlready = false;
	}
	constructor(gameCode) {
		// at the start of every round, reset all variables to defaults
		this.qNum = 1;
		this.gameCode = gameCode;
		this.greenPoints = 0;
		this.redPoints = 0;
		this.resetVariables();
	}

	tossUp(message, arg) {
		if (arg == "q") {
			this.tossRound = true;
			this.question = true;
			return "Toss Up question is now being read.";
		} else if (arg == "t") {
			this.question = false;
			// after 5 seconds, toss up round should end
			this.buzzerTimeout = message.client.setTimeout(() => {
				message.channel.send("Toss up round is over");
				this.tossRound = false;
			}, 5000);
			return "Toss up question has finished being read!";
		} else if (arg == "stop") {
			this.tossRound = false;
			return "Toss up is over!";
		} else {
			return "Please provide either `t` or `q` arg to `!nscore tu`";
		}
	}

	buzz(message) {
		// if a team is wrong, its players should not be able to buzz
		let buzzerEmbed = new Discord.MessageEmbed();
		let member = message.member;
		buzzerEmbed.fields = [];
		buzzerEmbed
			.setTitle("BUZZ!")
			.setAuthor("Science Bowl Helper")
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/747915124718829679/764537012148895764/buzz_1.png"
			);
		if (
			this.answerWrong &&
			!member.roles.cache.find(
				(r) => r.name.toLowerCase() === this.currentBuzzing
			)
		) {
			return "Your team can't buzz now.";
		}
		// if someone buzzes without there being a toss up round, cancel their buzz
		if (!this.tossRound) {
			return "Error: Tossup round hasn't started yet.";
		}
		// if someone has already buzzed, no one else should be buzzing.
		if (this.currentBuzzing && this.buzzedAlready) {
			return "Error: Cannot buzz while someone else is buzzing.";
		}
		// if someone buzzes, then the 5 second timer is stopped.
		const userName = member.user.username;
		if (member.roles.cache.find((r) => r.name === "Green")) {
			this.currentBuzzing = "green";
			buzzerEmbed.setColor("#50c878");
		} else {
			this.currentBuzzing = "red";
			buzzerEmbed.setColor("#ed2939");
		}
		message.client.clearTimeout(this.buzzerTimeout);
		this.buzzedAlready = true;
		if (this.question) {
			buzzerEmbed.addField("Interrupt From:", `**${member.displayName}**`);
			this.interrupt = true;
		}
		buzzerEmbed.addField("Team:", `${this.currentBuzzing.toUpperCase()}`);
		buzzerEmbed.addField("Message", `**${userName}, STATE YOUR ANSWER**`);
		return buzzerEmbed;
	}

	bonus(message) {
		this.bonusRound = true;
		this.buzzerTimeout = message.client.setTimeout(() => {
			message.channel.send("**BONUS ROUND IS OVER.**");
			return this.roundEnd();
		}, 20000);
		this.warningTimeout = message.client.setTimeout(() => {
			message.channel.send("**5 SECONDS LEFT...**");
		}, 15000);
		return "**BONUS ROUND HAS STARTED. YOU HAVE 20 SECONDS.**";
	}

	right() {
		if (this.tossRound) {
			this.tossRound = false;
			this.awardPoints(this.currentBuzzing, 4);
		} else if (this.bonusRound) {
			this.bonusRound = false;
			this.awardPoints(this.currentBuzzing, 10);
		}
		return "Points have successfully been added." + this.view();
	}

	wrong(message) {
		if (this.bonusRound) {
			return this.view() + "\n" + this.roundEnd();
		}
		this.answerWrong = true;
		if (this.currentBuzzing == "green") {
			this.currentBuzzing = "red";
			message.channel.send("WRONG");
		} else if (this.currentBuzzing == "red") {
			this.currentBuzzing = "green";
			message.channel.send("WRONG");
		} else {
			message.channel.send("contact **Michael Nath**");
		}
		if (this.attempts == 1) {
			if (this.interrupt) {
				this.awardPoints(this.currentBuzzing, 4);
			}
			return this.view() + this.roundEnd(message);
		}
		if (this.tossRound) {
			this.attempts += 1;
			// switches the team that's now buzzing
			this.buzzedAlready = false;
			if (this.interrupt) {
				this.awardPoints(this.currentBuzzing, 4);
				return (
					this.view() + "\n" + "Opposing team, wait for mod to reread question."
				);
			} else {
				buzzerTimeout = message.client.setTimeout(() => {
					message.channel.send("Toss up is over!");
					message.channel.send(this.view());
					this.tossRound = false;
				}, 6000);
				return "Opposing team, you may buzz now...";
			}
		}
	}

	view() {
		return (
			"The score is now:\n" +
			`Green: ${this.greenPoints} Red: ${this.redPoints}`
		);
	}

	awardPoints(team, amnt) {
		if (team == "green") {
			this.greenPoints += amnt;
		} else if (team == "red") {
			this.redPoints += amnt;
		}
	}

	roundEnd(message) {
		// reset all variables to defaults
		let qNum = this.qNum;
		this.resetVariables();
		message.client.clearTimeout(this.buzzerTimeout);
		message.client.clearTimeout(this.warningTimeout);
		return `**QUESTION ${qNum} HAS JUST ENDED.\n————QUESTION ${++qNum}————**`;
	}

	add(amnt, team) {
		if (team === "g") {
			this.greenPoints += amnt;
		} else if (team === "r") {
			this.redPoints += amnt;
		}
		return "Points have been **manually** added.";
	}

	inspect() {
		return {
			tossRound: this.tossRound,
			interrupt: this.interrupt,
			gameCode: this.gameCode,
		};
	}
}

module.exports = Game;
