const parsePacket = require('../parsepdfs/parsepdf.js')
const Discord = require('discord.js')
const fs = require("fs");

async function runSomething(message, pdfPath) {
    const finalFormattedPacket = await parsePacket(pdfPath)
    finalFormattedPacket.forEach((val, index) => {
        message.channel.send(val["bonus"]["question"])
    })
    return message.channel.send("SD")
}


module.exports = {
    name: "pack",
    usage: "<packet_name>",
    description: `\`pack\` command is an util used to retreive packets for review/competiton/etc.`,
    arges: true,
    execute(message, args) {
        const pdfPath = "./packets/6_12.pdf";
        if (args[0] == 'r') {
            runSomething(message, pdfPath)
            // parsePdf(pdfPath)
        } 
        else if (args[0] == 'l') {
            fs.readdirSync("./parsepdfs/packets").forEach(val => {
                message.channel.send(val)
            })
        }
    }
}