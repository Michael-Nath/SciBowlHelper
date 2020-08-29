const Discord = require("discord.js");

// inits a timer object that will hold a given start.
const timer = new Discord.Collection();
const getMethods = (obj) => {
	let properties = new Set();
	let currentObj = obj;
	do {
		Object.getOwnPropertyNames(currentObj).map((item) => properties.add(item));
	} while ((currentObj = Object.getPrototypeOf(currentObj)));
	return [...properties.keys()].filter(
		(item) => typeof obj[item] === "function"
	);
};
module.exports = {
	name: "timer",
	cooldown: 0.1,
	description:
		"makes bot act as a timer, allowing you to start and stop a timer session.",
	execute(message, args) {
		if (args[0] === "start" && !timer.get("start")) {
			timer.set("start", Date.now());
			return message.channel.send("Timer started!");
		}
		if (args[0] === "stop") {
			if (timer.get("start")) {
				const now = Date.now();
				const elapsed = (now - timer.get("start")) / 1000;
				timer.delete("start");
				return message.channel.send(`Time elapsed: ${elapsed}`);
				// console.log(getMethods(timer));
			} else {
				return message.channel.send(
					"You can't stop a timer session that hasn't been started, silly!"
				);
			}
		}
		message.channel.send(
			"This isn't a valid command (perhaps not yet)! Please check the manual"
		);
	},
};
