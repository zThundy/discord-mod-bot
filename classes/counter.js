const Discord = require('discord.js');

class Counter {
    constructor(config, client) {
        this.config = config;
        this.db = client.db;
        this.guild = client.guilds.cache.get(this.config.guildId)
        this.guild.channels.fetch(this.config.counter.channelId)
            .then(channel => {  
                this.channel = channel;
            });
        
        this.db.getCounter({ guildId: this.guild.id })
            .then(row => {
                if (row) {
                    this.count = row.counter;
                } else {
                    this.count = 0;
                }
            });
    }

    checkCount(message) {
        if (!this.config.counter.enabled) return;
        if (message.channel.id !== this.config.counter.channelId) return;
        if (message.author.bot) return;
        var number = Number(message.content);
        if (number > this.count && number == this.count + 1) {
            this.increment();
        } else {
            this.endGame(message);
        }
    }

    // edit channel description to show the current count
    increment() {
        this.count++;
        this.db.updateCounter({ guildId: this.guild.id, counter: Number(this.count) });
    }

    endGame(message) {
        const embed = new Discord.MessageEmbed()
            .setTitle("Game Over")
            .setDescription("The highscore was " + this.count)
            .setColor(0xFF0000);
        this.channel.setTopic(`Latest highscore ${this.count}`);
        this.count = 0;
        this.db.removeCounter({ guildId: this.guild.id });
        message.channel.send({ embeds: [embed] });
    }
}

module.exports = Counter;