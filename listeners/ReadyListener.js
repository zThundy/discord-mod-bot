class Listener {
    constructor(config) {
        this.config = config;
    }

    run(client) {
        console.log("Bot ready and listening!");

        client.guilds.cache.forEach(guild => {
            if (guild.id !== this.config.guildId) {
                guild.leave();
            }
        });
    }
}

module.exports = Listener;