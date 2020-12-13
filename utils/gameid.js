function generateID() {
    const gameCode = Math.trunc(10000 * Math.random());
    return gameCode;
}

module.exports = generateID;