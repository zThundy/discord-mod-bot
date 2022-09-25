class Listener {
    constructor(client) {
        this.cLoader = client.modules.get("config");
        this.config = this.cLoader.get();
    }

    run(event) {
    }
}

module.exports = Listener;