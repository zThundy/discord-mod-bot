class Listener {
    constructor(client) {
        this.cLoader = client.modules.get("config");
        this.config = this.cLoader.get();
    }

    run(event, client, guild) {
        switch(event) {
            case "guildCreate":
                if (guild.id !== this.config.guildId) {
                    guild.leave();
                }
                break;
        }
    }
}

module.exports = Listener;