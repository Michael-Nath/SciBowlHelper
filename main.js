const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const fs = require("fs");

const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const commandFiles = fs
	.readdirSync("./commands")
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once("ready", () => {
	console.log("Ready!");
});

client.on("message", (message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) {
		message.channel.send(
			"Sorry! This command is not in the list of available commands."
		);
		return;
	}

	const command = client.commands.get(commandName);
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;
		if (command.usage) {
			reply +=
				`\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``
		}
		return message.channel.send(reply);
	}
	try {
		command.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply("Sorry. It appears an error has occured.");
	}
	// other commands...
});

client.login(token);
