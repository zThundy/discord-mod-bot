class Listener {
    constructor(config, client) {
        this.config = config;
        this.counter = client.modules.get("usersCount");
    }

    run(client) {
        client.guilds.cache.forEach(guild => {
            if (guild.id !== this.config.guildId) {
                guild.leave();
            } else {
                this.counter.update(guild);
            }
        });
    }
}

module.exports = Listener;