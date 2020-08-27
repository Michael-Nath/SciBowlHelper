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
	"Atkins' Physical Chemistry",
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

module.exports = {
	name: "books",
	usage: "<subject>",
	description: `\`books\` command lists books used in the club. To get all books, it's \`!books all\`. To get subject books it's \`!books <subject>\`, where subject is one of the following: **bio**, **chem**, **earthspace**, **physics**, **math**`,
	args: true,
	execute(message, args) {
		if (args[0] === "all") {
			message.channel.send(
				"I've sent you a DM with all the books that you've requested for"
			);
			return message.author.send(
				biologyBooks +
					chemistryBooks +
					earthAndSpaceBooks +
					physicsBooks +
					mathBooks
			);
		}

		try {
			const subject = args[0];
			const books = textbooks[subject];
			if (!books) {
				return message.channel.send(
					`Please make sure that you type in a subject in the way that's described in \`!info books\``
				);
			}
			message.channel.send(books);
		} catch (error) {
			console.log(error);
			message.channel.send(
				"An error has occured while executing this command. Please contact **Michael Nath**"
			);
		}
	},
};
