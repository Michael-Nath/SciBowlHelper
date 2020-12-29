const fs = require("fs");
const pdf = require("pdf-parse");
const path = require("path");

async function getQuestionPairs(pdfPath) {
	let dataBuffer = fs.readFileSync(path.resolve(__dirname, pdfPath));
	const questionPairs = await pdf(dataBuffer);
	return questionPairs.text.split("\n\n");
}

async function mergePairs(formattedPairs) {
    const size = formattedPairs.length;
    // console.log(formattedPairs);
	const mergedPairs = [];
	for (i = 0; i < size - 1; i += 2) {
		const mergedPair = {};
		mergedPair["qNum"] = formattedPairs[i]["questionNum"];
		mergedPair["qType"] = formattedPairs[i]["questionSubject"];
		mergedPair["tossUp"] = formattedPairs[i];
		mergedPair["bonus"] = formattedPairs[i + 1];
		mergedPairs.push(mergedPair);
	}
	console.log(mergedPairs);
}
async function prettifyQuestionPairs(questionPairs) {
	let numQuestions = 0;
	let formattedQuestionPairs = [];
	var questionPair = {};
	for (i = 0; i < questionPairs.length; i++) {
		const page = questionPairs[i].split(" \n \n");
		// console.log(page)
		for (j = 0; j < page.length; j++) {
			if (!isNaN(page[j].trim()[0]) && page[j][0] != "") {
				const qDetails = page[j].split("  ");

				const qNum = parseInt(
					qDetails[0].trim().substring(0, qDetails[0].trim().length)
				);
				numQuestions += 1;
				var question;
				var choices;
				var answer;
				questionPair["questionNum"] = qNum;
				questionPair["questionSubject"] = qDetails[1].toLowerCase();
				questionPair["questionType"] = qDetails[2].toLowerCase();
				question = qDetails.slice(3, qDetails.length).join(" ");

				if (questionPair["questionType"] == "multiple choice") {
					choices = page[j + 1];
					answer = page[j + 2];
				} else {
					answer = page[j + 1];
				}
				if (question.indexOf("ANSWER") != -1) {
					const splittedQuestion = question.split(" \n \n");
					question = splittedQuestion[0];
					answer = splittedQuestion[1];
				}

				questionPair["question"] = question.split("\n").join("");
				if (questionPair["questionType"] == "multiple choice") {
					questionPair["questionChoices"] = choices;
				}
				questionPair["questionAnswer"] = answer;
				formattedQuestionPairs.push(questionPair);
				questionPair = {};
			}
		}
	}
	return formattedQuestionPairs;
}

async function parsePacket(pdfPath) {
	getQuestionPairs(pdfPath).then((pair) => {
		prettifyQuestionPairs(pair).then((formattedPairs) => {
			mergePairs(formattedPairs);
		});
	});
}
const pdfPath = "./packets/1_1.pdf";
parsePacket(pdfPath);
