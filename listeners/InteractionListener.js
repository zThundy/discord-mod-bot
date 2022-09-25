class Listener {
    constructor(client) {
        this.cLoader = client.modules.get("config");
        this.config = this.cLoader.get();
    }

    run(event, client, interaction) {

    }
}

module.exports = Listener;