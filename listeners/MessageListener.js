const ChannelCounter = require("../classes/usersCount.js");

class Listener {
    constructor(config) {
        this.config = config;
        this.counter = new ChannelCounter(config);
    }

    run(client, message) {
        if (message.guild.id !== this.config.guildId) return;
        this.counter.update(message.guild)
        console.log("New message: " + message.content);
        
        if (message.type === "GUILD_MEMBER_JOIN") {
            // find specific role and add to user
            const role = message.guild.roles.cache.find(role => role.id === this.config.userRole);
            // assign that role to the user
            message.member.roles.add(role);
        }
    }
}

module.exports = Listener;