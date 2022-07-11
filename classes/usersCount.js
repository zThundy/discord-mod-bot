if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

class Counter {
    constructor(config) {
        this.config = config;
        if (this.config.usersCount.enabled) this._clock();
        // TODO: add Db connection
        this.cachedUsersCount = 0;
        this.guild = null;
    }

    update(guild) {
        this.guild = guild;
        this.cachedUsersCount = guild.members.cache.size;
    }

    _clock() {
        console.log("Clocking users count");
        if (this.guild && this.cachedUsersCount)
            this.guild.channels.cache.get(this.config.usersCount.channelId).setName(this.config.usersCount.channelName.format(this.cachedUsersCount));
        setTimeout(() => this._clock(), 60 * 10 * 1000);
    }
}

module.exports = Counter;