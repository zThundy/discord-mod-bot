class Listener {
    constructor(config) {
        this.config = config;
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