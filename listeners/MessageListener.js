const { Permissions } = require('discord.js');

class Listener {
    constructor(config, client) {
        this.config = config;
        this.reactions = client.modules.get("userReactions");
        this.wordFilter = client.modules.get("wordFilter");
    }

    run(event, ...args) {
        switch(event) {
            case "messageCreate":
                this.messageCreate(...args);
                break;
            case  "messageDelete":
                this.messageDelete(...args);
                break;
            case "messageUpdate":
                this.messageUpdate(...args);
                break;
        }
    }

    messageCreate(client, message) {
        // check if the message is from the configured guild
        if (message.guild.id !== this.config.guildId) return;
        // check if the word filter is enabled in the config file
        if (this.config.wordsFilter.enabled) if (!this.wordFilter.checkMessage(message)) return;
        
        // check if the sent message is a user joining the server, if so, add the role
        if (message.type === "GUILD_MEMBER_JOIN" && this.config.roleAssigner.enabled) {
            // find specific role and add to user
            const role = message.guild.roles.cache.find(role => role.id === this.config.roleAssiger.userRole);
            // assign that role to the user
            message.member.roles.add(role);
        }

        // check if the message is beeing sent from a bot
        if (message.author.bot) return;
        // check if the message is sent from someone that is not an admin
        if (message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return;

        if (message.mentions.users.has(client.user.id)) {
            if (message.content.includes("reaction")) {
                if (message.type === "REPLY") {
                    // split the command
                    message.content = message.content.split("reaction")[1];
                    message.content = message.content.trim();
                    // get the action that the user is trying to do
                    var action = "";
                    if (message.content.includes("add") || message.content.includes("new")) action = "add";
                    if (message.content.includes("remove") || message.content.includes("delete")) action = "remove";
                    // apply logic to the action
                    switch(action) {
                        case "add":
                            message.content = message.content.split("add");
                            var reactions = this.reactions.createArray(message.content[1]);
                            if (typeof reactions === "string") {
                                return message.reply(reactions)
                                    .then(msg => {
                                        message.delete();
                                        setTimeout(() => msg.delete(), 10000);
                                    });
                            }
                            this.reactions.add(message, {
                                guildId: message.guild.id,
                                channelId: message.channel.id,
                                messageId: message.reference.messageId,
                                reactions: JSON.stringify(reactions)
                            });
                            break;

                        case "remove":
                            message.content = message.content.split("remove")[1];
                            this.reactions.remove(message, {
                                guildId: message.guild.id,
                                channelId: message.channel.id,
                                messageId: message.reference.messageId
                            });
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

    messageDelete(client, message) {
        // check if the message is from the configured guild
        if (message.guild.id !== this.config.guildId) return;
    }

    messageUpdate(client, oldMessage, newMessage) {
        // check if the message is from the configured guild
        if (oldMessage.guild.id !== this.config.guildId) return;
    }
}

module.exports = Listener;