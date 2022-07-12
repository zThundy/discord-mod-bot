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
        if (this.config.userCount.enabled) this._clock();
        // TODO: add Db connection
        this.cacheduserCount = 0;
        this.guild = null;
    }

    update(guild) {
        console.log("    >> Calling update in Counter");
        this.guild = guild;
        this.cacheduserCount = guild.members.cache.size;
    }

    _clock() {
        console.log("    >> Clocking user count");
        if (this.guild && this.cacheduserCount)
            this.guild.channels.cache.get(this.config.userCount.channelId).setName(this.config.userCount.channelName.format(this.cacheduserCount));
        setTimeout(() => this._clock(), 60 * 10 * 1000);
    }
}

module.exports = Counter;