class Listener {
    constructor(config, client) {
        this.config = config;
        this.counter = client.modules.get("userCount");
    }

    run(event, client) {
        client.guilds.cache.forEach(guild => {
            if (guild.id !== this.config.guildId) {
                guild.leave();
            } else {
                this.counter.update(guild);
            }
        });

        client.user.setActivity(this.config.status.message, {
            type: this.config.status.type,
            url: this.config.status.url
        });
    }
}

module.exports = Listener;