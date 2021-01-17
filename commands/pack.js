const parsePacket = require("../parsepdfs/parsepdf.js");
const Discord = require("discord.js");
const fs = require("fs");

async function runSomething(message, pdfPath) {
	const finalFormattedPacket = await parsePacket(pdfPath);
	finalFormattedPacket.forEach((val, index) => {
		message.channel.send(val["bonus"]["question"]);
	});
	return message.channel.send("SD");
}

function getPacketAsPdf(message, pdfPath) {
	if (!message.member.roles.cache.has("760208780485984306")) {
		return message.channel.send(
			"You need to be a moderator to use this command"
		);
	}
	const modifiedPdfPath = "./parsepdfs/packets/" + pdfPath;
	return message.author.send("Here is the packet that you've requested:", {
		files: [
			{
				attachment: modifiedPdfPath,
				name: pdfPath,
			},
		],
	});
}

async function getPacketStats(message, pdfPath) {
	const modifiedPdfPath = "packets/" + pdfPath;
	const finalFormattedPacket = await parsePacket(modifiedPdfPath);
	// get the amount of questions by subject
	let mathQuestions = 0;
	let earthSciQuestions = 0;
	let bioQuestions = 0;
	let physicsQuestions = 0;
	let chemQuestions = 0;
	finalFormattedPacket.forEach((qPair) => {
        console.log(qPair)
		switch (qPair["subject"]) {
			case "biology":
				bioQuestions += 1;
			case "earth":
				earthSciQuestions += 1;
			case "chem":
				chemQuestions += 1;
			case "math":
				mathQuestions += 1;
			case "physics":
				physicsQuestions += 1;
		}
	});
	const initialMessage = `packet \`${pdfPath}\`:`;
	const subjectMessage = `math: ${mathQuestions} | earth: ${earthSciQuestions} | bio: ${bioQuestions} | physics: ${physicsQuestions} | chem: ${chemQuestions}`;
	const overallMessage = initialMessage + subjectMessage;
	return message.channel.send(overallMessage);
}

module.exports = {
	name: "untouchable",
	usage: "<packet_name>",
	description: `\`pack\` command is an util used to retreive packets for review/competiton/etc.`,
	arges: true,
	execute(message, args) {
		if (args[0] == "g") {
			if (args.length == 1) {
				return message.channel.send(
					"Oops, it looks like you didn't provide a path to the packet! I suggest typing in `!pack l` to get all available packets."
				);
			}
			const pdfPath = args[1];
			getPacketAsPdf(message, pdfPath);
		} else if (args[0] == "l") {
			fs.readdirSync("./parsepdfs/packets").forEach((val) => {
				message.channel.send(val);
			});
		} else if (args[0] == "s") {
			if (args.length == 1) {
				return message.channel.send(
					"Oops, it looks like you didn't provide a path to the packet! I suggest typing in `!pack l` to get all available packets."
				);
			}
			const pdfPath = args[1];
			getPacketStats(message, pdfPath);
		}
	},
};
