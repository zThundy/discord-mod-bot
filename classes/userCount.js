if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

class Counter {
    constructor(config, client) {
        this.config = config;
        // TODO: add Db connection
        this.guild = client.guilds.cache.get(this.config.guildId);
        this.cacheduserCount = 0;
    }

    run() {
        console.log(">> Clocking user count");
        this.cacheduserCount = this.guild.members.cache.filter(member => !member.user.bot).size;
        if (this.guild && this.cacheduserCount) {
            this.guild.channels.fetch(this.config.userCount.channelId).then(channel => {
                channel.setName(this.config.userCount.message.format(this.cacheduserCount));
            });
        }
    }
}

module.exports = Counter;