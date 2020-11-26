const Discord = requite("discord.js");
class Player {
    constructor(displayName, userName) {
        this.displayName = displayName;
        this.userName = userName;
        this.points = 0;
    }
    addPoints(points) {
        this.points += points;
    }
}

module.exports = Player;