const fs = require("fs");
const pdf = require("pdf-parse");
const path = require("path");

async function getQuestionPairs(pdfPath) {
	let dataBuffer = fs.readFileSync(path.resolve(__dirname, pdfPath));
	const questionPairs = await pdf(dataBuffer);
	return questionPairs.text.split("\n\n");
}

async function prettifyQuestionPairs(questionPairs) {
	let numQuestions = 0;
	for (i = 0; i < questionPairs.length; i++) {
        const page = questionPairs[i].split(" \n \n");
		for (j = 0; j < page.length; j++) {
			// console.log(page[j][0]);
			// console.log(isNaN(page[j][0]));
			if (!isNaN(page[j].trim()[0]) && page[j][0] != "") {
				numQuestions += 1;
			}
		}
	}
	console.log(numQuestions / 2);
	// prettify it so that the new questionPairs is in the form of an array of objects where:
	// [questionType, questionNum, (choices), {tossUp}, {bonus}]
	/* 
        {
            questionNum: 
            tossUp: {
                questionType:
                choices: []
                answer: 
            } 
            bonus: {
                questionType: 
                choices: []
                answer:
            }
        }
    */
}

async function parsePacket(pdfPath) {
	getQuestionPairs(pdfPath).then((pair) => {
		prettifyQuestionPairs(pair);
	});
}
const pdfPath = "./packets/1_1.pdf";
parsePacket(pdfPath);
