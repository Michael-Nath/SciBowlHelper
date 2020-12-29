class Player {
    constructor(displayName, userName, userId) {
        this.displayName = displayName;
        this.userName = userName;
        this.userId = userId;
        this.points = 0;
        this.interruptCorrect = 0;
        this.interruptTotal = 0;
    }
    addPoints(points) {
        this.points += points;
    }
    getDisplayName() {
        return this.displayName;
    }
    getUserName() {
        return this.userName;
    }
    getUserId() {
        return this.userId;
    }

    getStat() {
        return `Player: ${this.userName} | Points: ${this.points}\n`
    }
}

module.exports = Player;