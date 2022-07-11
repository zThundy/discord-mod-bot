class Listener {
    constructor(config) {
        this.config = config;
    }

    run(client, guild) {
        if (guild.id !== this.config.guildId) {
            guild.leave();
        }
    }
}

module.exports = Listener;