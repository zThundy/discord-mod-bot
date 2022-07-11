class Listener {
    constructor(config, client) {
        this.config = config;
        this.counter = client.modules.get("usersCount");
        this.reactions = client.modules.get("userReactions");
    }

    run(client, message) {
        if (message.guild.id !== this.config.guildId) return;
        this.counter.update(message.guild);
        console.log("New message: " + message.content);
        
        if (message.type === "GUILD_MEMBER_JOIN") {
            // find specific role and add to user
            const role = message.guild.roles.cache.find(role => role.id === this.config.userRole);
            // assign that role to the user
            message.member.roles.add(role);
        }

        if (message.mentions.users.has(client.user.id)) {
            if (message.content.includes("reaction")) {
                if (message.type === "REPLY") {
                    message.content = message.content.split("reaction")[1];
                    message.content = message.content.trim();
                    switch(message.content) {
                        case "add":
                            this.reactions.add(message, {
                                guildId: message.guild.id,
                                channelId: message.channel.id,
                                messageId: message.reference.messageId
                            })
                            break;

                        case "remove":
                            this.reactions.remove(message, {
                                guildId: message.guild.id,
                                channelId: message.channel.id,
                                messageId: message.reference.messageId
                            })
                            break;
                    }
                } else {
                    message.reply("You can only use this command in a reply.")
                        .then(msg => {
                            setTimeout(() => msg.delete(), 5000);
                        });
                }
            }
        }
    }
}

module.exports = Listener;