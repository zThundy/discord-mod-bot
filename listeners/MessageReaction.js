class Listener {
    constructor(config, client) {
        this.config = config;
        this.reactions = client.modules.get("userReactions");
    }

    run(client, adding, reaction, user) {

    }
}

module.exports = Listener;