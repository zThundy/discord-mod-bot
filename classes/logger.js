class Logger {
    constructor(config, client) {
        this.config = config;
        this.guild = client.guilds.cache.get(config.guildId)
        this.guild.channels.fetch(config.logs.channelId)
            .then(channel => {  
                this.channel = channel;
                console.log(this.channel)
            });
    }

    log(event) {
        if (!this.config.logs.enabled) return;

        this.channel.send(`Event: ${event}`);
    }
}

module.exports = Logger;