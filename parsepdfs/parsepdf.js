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
	const mergedPairs = [];
	for (i = 0; i < size - 1; i += 2) {
		const mergedPair = {};
		mergedPair["qNum"] = formattedPairs[i]["questionNum"];
		mergedPair["subject"] = formattedPairs[i]["questionSubject"];
		mergedPair["tossUp"] = formattedPairs[i];
		mergedPair["bonus"] = formattedPairs[i + 1];
		mergedPairs.push(mergedPair);
	}
	return mergedPairs;
}
async function prettifyQuestionPairs(questionPairs) {
	let formattedQuestionPairs = [];
	var questionPair = {};
	let numQuestions = 0;
	for (i = 0; i < questionPairs.length; i++) {
		const page = questionPairs[i].split(" \n \n");
		for (j = 0; j < page.length; j++) {
			if (!isNaN(page[j].trim()[0]) && page[j][0] != "") {
				const qDetails = page[j].split("  ");
				qIntro = qDetails[0].trim().split(" "); // qIntro refers to the first two details of a question (question # and subject)
				const qNum = parseInt(qIntro[0]);
				numQuestions += 1;
				var question;
				var choices;
				var answer;

				let subjectIndex;
				let k;
				for (k = 0; k < qDetails.length; k++) {
					if (
						["multiple choice", "short answer"].includes(
							qDetails[k].trim().toLowerCase()
						)
					) {
						subjectIndex = k;
					}
				}
				questionPair["questionNum"] = qNum;
				questionPair["questionSubject"] = qIntro[1].toLowerCase();
				questionPair["questionType"] = qDetails[subjectIndex].toLowerCase();
				question = qDetails.slice(subjectIndex + 1, qDetails.length).join(" ");

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
	const pair = await getQuestionPairs(pdfPath);
	const formattedPairs = await prettifyQuestionPairs(pair)
	const mergedPairs = await mergePairs(formattedPairs)
	return mergedPairs;
}

module.exports = parsePacket;
