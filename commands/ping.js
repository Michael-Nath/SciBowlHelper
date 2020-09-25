blocked = true;

module.exports = {
	name: "ping",
	description: "ping",
	execute(message, args) {
		start = Date.now();
		if (blocked) {
			blocked = false;
			// message.reply(myFunction());
			return message.reply("YOU ARE FIRST");
		}
		// message.reply(myFunction());
		return message.reply("YOU ARE LAST");
	},
};
