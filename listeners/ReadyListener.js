class Listener {
    constructor(config) {
        this.config = config;
    }

    run(client) {
        console.log("Bot ready and listening!");
    }
}

module.exports = Listener;