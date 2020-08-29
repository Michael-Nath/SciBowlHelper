const Discord = require("discord.js");
const biologyBooks = [
	"Campbell's Biology 11th Edition",
	"Molecular Biology of the Cell by Bruce Alberts",
	"Essential Cell Biology",
	"Vander's Human Physiology",
	"Lehniger Principles of Biochemistry",
	"Biology of Animals by Hickman",
	"Stern's Introductory Plant Biology",
	"Biology by Raven",
	"Plant Physiology by Lincoln Taiz",
];

const chemistryBooks = [
	"Chemistry by Zumdahl",
	"Physical Chemistry by Atkins",
	"Organic Chemistry by David Klein",
	"Organic Chemistry by Jonathan Clayden",
];

const earthAndSpaceBooks = [
	"Earth Science by Tarbuck",
	"Foundations of Astronomy by Seeds",
	"Essentials of Geology by Marshak",
	"Fundamental Astronomy by Karttunen",
	"Essentials of Meteorology by Ahrens",
	"Essentials of Oceanography by Thurman",
	"An Introduction to Modern Astrophysics by Ostlie",
];

const physicsBooks = [
	"Fundamentals of Physics by Halliday, Resnick, and Krane",
	"Introduction to Classical Mechanics: With Problems and Solutions by Morin",
	"Physics Volume 1, 2 by Krane",
	"Particle Physics by Close",
];

const mathBooks = [
	"Volume 1: The Basics by The Art of Problem Solving",
	"Volume 2: And Beyond by The Art of Problem Solving",
	"Calculus by Stewart",
	"Euclidean Geometry in Mathematical Olympiads (EGMO) by Chen",
	"Introduction to Number Theory by The Art of Problem Solving",
	"Introduction to Counting and Probability by The Art of Problem Solving",
];

const textbooks = {
	bio: biologyBooks,
	chem: chemistryBooks,
	earthspace: earthAndSpaceBooks,
	physics: physicsBooks,
	math: mathBooks,
};

const embedBooks = new Discord.MessageEmbed();
// setting title of message
embedBooks.setTitle("Science Bowl Books");
// setting name of message
embedBooks.setAuthor("From Science Bowl Repository");
// giving description of message
embedBooks.setDescription("Here are the available books as per your request!");

// setting timestamp of tthe message
embedBooks.setTimestamp();

module.exports = {
	name: "books",
	usage: "<subject>",
	description: `\`books\` command lists books used in the club. To get all books, it's \`!books all\`. To get subject books it's \`!books <subject>\`, where subject is one of the following: **bio**, **chem**, **earthspace**, **physics**, **math**`,
	args: true,
	execute(message, args) {
		if (args[0] === "all") {
			if (embedBooks.fields.length != 0) {
				embedBooks.spliceFields(0, 5);
			}
			message.channel.send(
				"I've sent you a DM with all the books that you've requested for"
			);
			embedBooks.addFields(
				{
					name: "Biology",
					value: biologyBooks.map((val, key) => `*${val}*`).join("\n"),
				},
				{
					name: "Chemistry",
					value: chemistryBooks.map((val, key) => `*${val}*`).join("\n"),
				},
				{
					name: "Earth and Space",
					value: earthAndSpaceBooks.map((val, key) => `*${val}*`).join("\n"),
				},
				{
					name: "Physics",
					value: physicsBooks.map((val, key) => `*${val}*`).join("\n"),
				},
				{
					name: "Mathematics",
					value: mathBooks.map((val, key) => `*${val}*`).join("\n"),
				}
			);

			return message.author.send(embedBooks);
		}

		try {
			const subject = args[0];
			const books = textbooks[subject];
			const translations = {
				bio: "Biology",
				chem: "Chemistry",
				physics: "Physics",
				earthspace: "Earth and Space",
				math: "Mathematics",
			};
			if (!books) {
				return message.channel.send(
					`Please make sure that you type in a subject in the way that's described in \`!info books\``
				);
			}
			embedBooks.addField(
				translations[subject],
				books.map((val, key) => `*${val}*`).join("\n")
			);
			message.channel.send(embedBooks);
			embedBooks.spliceFields(0, 1);
		} catch (error) {
			console.log(error);
			message.channel.send(
				"An error has occured while executing this command. Please contact **Michael Nath**"
			);
		}
	},
};
