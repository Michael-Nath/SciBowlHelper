const Discord = require("discord.js");
const { token, prefix } = require("./config.json");

const client = new Discord.Client();

client.once("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;
	const args = msg.content.slice(prefix.length).trim().split(" ");
	const command = args.shift().toLowerCase();
	if (command === "args-info") {
		if (!args.length) {
			return msg.channel.send(
				`You didn't provide any arguments, ${msg.author}!`
			);
		}
		if (args.includes("biology")) {
			return msg.channel.send("BIOLOGY IS COOL I AGREE.");
		}
		msg.channel.send(`Command name: ${command}\nArguments: ${args}`);
	}
	// if (msg.content.startsWith(`${prefix}ping`)) {
	// 	msg.channel.send("Pong!");
	// } else if (msg.content.startsWith(`${prefix}greet`)) {
	// 	msg.channel.send(`${msg.author}, Hello!`);
	// } else if (msg.content.startsWith(`${prefix}server`)) {
	// 	msg.channel.send(
	// 		`Welcome to ${msg.guild.name}!\nTotal Members: ${msg.guild.memberCount}`
	// 	);
	// }
});

client.login(token).catch((err) => console.error(err));
