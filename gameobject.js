class GameObject {
  function resetVariables(message, args) {
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

  constructor() {
  	// at the start of every round, reset all variables to defaults
    resetVariables();
  }

  function tossUp(arg) {
  	if (arg == "q") {
  		this.tossRound = true;
  		this.question = true;
  		return "Toss Up question is now being read.";
  	}
    else if (arg == "start") {
  		this.question = false;
  		// after 5 seconds, toss up round should end
  		return "Toss up question has finished being read!";
  	}
    else if (arg == "stop") {
      this.tossRound = false;
      return "Toss up is over!";
    }
    else {
  		return "Please provide either `t` or `q` arg to `!nscore tu`";
  	}
  }

  function buzz(member) {
  	// if a team is wrong, its players should not be able to buzz
    let buzzerEmbed = new Discord.MessageEmbed();
    buzzerEmbed.fields = [];

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
  	userName = member.user.username;
  	if (member.roles.cache.find((r) => r.name === "Green")) {
  		this.currentBuzzing = "green";
  		buzzerEmbed.setColor("#50c878");
  	} else {
  		this.currentBuzzing = "red";
  		buzzerEmbed.setColor("#ed2939");
  	}

  	this.buzzedAlready = true;
  	if (this.question) {
  		buzzerEmbed.addField(
  			"Interrupt From:",
  			`**${message.member.displayName}**`
  		);
  		this.interrupt = true;
  	}
  	buzzerEmbed.addField("Team:", `${currentBuzzing.toUpperCase()}`);
  	buzzerEmbed.addField("Message", `**${userName}, STATE YOUR ANSWER**`);
  	return buzzerEmbed;
  }

  function bonus(arg) {
    if (arg == "start") {
      this.bonusRound = true;
  		return "**BONUS ROUND HAS STARTED. YOU HAVE 20 SECONDS.**";
  	}
    else if (arg == "warn") {
      return "**5 SECONDS LEFT...**";
    }
    else if (arg == "stop") {
      this.bonusRound = false;
      return "**BONUS ROUND IS OVER.**"
    }
    else {
      return "wrong argument passed"
    }
  }

  function right() {
    if (this.tossRound) {
  		this.tossRound = false;
  		awardPoints(this.currentBuzzing, 4, message);
  	} else if (this.bonusRound) {
  		this.bonusRound = false;
  		awardPoints(this.currentBuzzing, 10, message);
  	}
  	return "Points have successfully been added." + view();
  }

  function wrong(message, args) {
  	if (bonusRound) {
  		view(message, args);
  		return roundEnd(message, args);
  	}
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
  }

  function view() {
  	return "The score is now:\n"  + `Green: ${this.greenPoints} Red: ${this.redPoints}`;
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
  	resetVariables(message, args);
  	return message.channel.send(
  		`**QUESTION ${qNum} HAS JUST ENDED.\n————QUESTION ${++qNum}————**`
  	);
  }

  function add(message, args) {
  	if (!message.member.roles.cache.find((r) => r.name === "Moderator")) {
  		return message.channel.send(
  			"You must be a **moderator** to use this command."
  		);
  	}
  	amnt = parseInt(args[1], 10);
  	if (args[2] === "g") {
  		greenPoints += amnt;
  	} else if (args[2] === "r") {
  		redPoints += amnt;
  	}
  	return message.channel.send("Points have been **manually** added.");
  }

  function stop(message, args) {
  	if (!message.member.roles.cache.find((r) => r.name === "Moderator")) {
  		return message.channel.send(
  			"You must be a **moderator** to use this command."
  		);
  	}
  	message.client.clearTimeout(buzzerTimeout);
  	message.client.clearTimeout(warningTimeout);
  	resetVariables(message, args);
  	greenPoints = 0;
  	redPoints = 0;
  	qNum = 0;
  	return message.channel.send(
  		"Game has ended. Please start it again if you'd like to keep playing."
  	);
  }

}
