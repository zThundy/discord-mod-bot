const Discord = require("discord.js");

class Logger {
    constructor(client) {
        this.cLoader = client.modules.get("config");
        this.config = this.cLoader.get();
        this.guild = client.guilds.cache.get(this.config.guildId)
        this.guild.channels.fetch(this.config.logs.channelId)
            .then(channel => {  
                this.channel = channel;
            });
        this.userId = client.user.id;
    }

    reloadChannel() {
        if (this.channel.id !== this.config.logs.channelId) {
            console.log("       >> Reloading channel for logger");
            this.guild.channels.fetch(this.config.logs.channelId)
                .then(channel => {  
                    this.channel = channel;
                });
        }
    }

    run(event, ...args) {
        // update config every call cause YES
        this.config = this.cLoader.get();
        // reload channel if needed
        this.reloadChannel();
        // check if the event is enabled
        console.log("    >> Calling logger for: " + event);
        if (!this.config.logs.enabled) return;
        if (!this[event]) return;

        // send the embed
        var message = this[event](...args);
        if (!message) return;
        this.channel.send({ embeds: [message] });
    }

    messageCreate(client, message) {
        if (message.author.bot) return;
        if (message.author.id === this.userId) return;
        if (message.channel.type === "DM") return;
        if (message.channel.id === this.config.logs.channelId) return;

        var _messageName = (message.type === "DEFAULT" || message.type === "REPLY" ? "Message" : "Type")
        var _messageValue = "```" + (message.type === "DEFAULT" || message.type === "REPLY" ? message.content : message.type) + "```"
        var _messageCleanContent = "```" + message.cleanContent + "```"
        if (message.content.length === 0) _messageValue = "```Unknown```"
        if (message.cleanContent.length === 0) _messageCleanContent = "```Unknown```"

        const embed = new Discord.MessageEmbed()
            .setTitle(`Message sent by ***${message.author.username}*** in ***${message.channel.name}***`)
            .setColor("#00ff00")
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
            .addFields(
                { name: _messageName, value: _messageValue, inline: true },
                { name: "Clean Content", value: _messageCleanContent, inline: true },
                { name: "Link", value: `[Go to message](${message.url})` },
                { name: "Channel", value: `<#${message.channel.id}>` },
            )
            .setTimestamp()
            .setFooter({ text: "Made with ❤️ by zThundy" });

        return embed;
    }

    messageDelete(client, message) {
        if (message.author.bot) return;
        if (message.author.id === this.userId) return;
        if (message.channel.type === "DM") return;
        if (message.channel.id === this.config.logs.channelId) return;

        var _messageName = (message.type === "DEFAULT" || message.type === "REPLY" ? "Message" : "Type")
        var _messageValue = "```" + (message.type === "DEFAULT" || message.type === "REPLY" ? message.content : message.type) + "```"
        if (message.content.length === 0) _messageValue = "```Unknown```"

        const embed = new Discord.MessageEmbed()
            .setTitle(`Message deleted by ***${message.author.username}*** in ***${message.channel.name}***`)
            .setColor("#ff0000")
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
            .addFields(
                { name: _messageName, value: _messageValue, inline: true },
                { name: "Channel", value: `<#${message.channel.id}>` },
            )
            .setTimestamp()
            .setFooter({ text: "Made with ❤️ by zThundy" });

        return embed;
    }

    messageUpdate(client, oldMessage, newMessage) {
        if (newMessage.author.bot) return;
        if (newMessage.author.id === this.userId) return;
        if (newMessage.channel.type === "DM") return;
        if (newMessage.channel.id === this.config.logs.channelId) return;

        var _oldMessageName = (oldMessage.type === "DEFAULT" || oldMessage.type === "REPLY" ? "Message" : "Type")
        var _oldMessageValue = "```" + (oldMessage.type === "DEFAULT" || oldMessage.type === "REPLY" ? oldMessage.content : oldMessage.type) + "```"
        var _newMessageName = (newMessage.type === "DEFAULT" || newMessage.type === "REPLY" ? "Message" : "Type")
        var _newMessageValue = "```" + (newMessage.type === "DEFAULT" || newMessage.type === "REPLY" ? newMessage.content : newMessage.type) + "```"
        var _oldMessageCleanContent = "```" + oldMessage.cleanContent + "```"
        var _newMessageCleanContent = "```" + newMessage.cleanContent + "```"
        if (oldMessage.content.length === 0) _oldMessageValue = "```Unknown```"
        if (newMessage.content.length === 0) _newMessageValue = "```Unknown```"
        if (oldMessage.cleanContent.length === 0) _oldMessageCleanContent = "```Unknown```"
        if (newMessage.cleanContent.length === 0) _newMessageCleanContent = "```Unknown```"

        const embed = new Discord.MessageEmbed()
            .setTitle(`Message edited by ***${newMessage.author.username}*** in ***${newMessage.channel.name}***`)
            .setColor("#0000ff")
            .setAuthor({ name: oldMessage.author.username, iconURL: oldMessage.author.displayAvatarURL() })
            .addFields(
                { name: _oldMessageName, value: _oldMessageValue },
                { name: _newMessageName, value: _newMessageValue },
                { name: "Old Clean Content", value: _oldMessageCleanContent },
                { name: "New Clean Content", value: _newMessageCleanContent },
                { name: "Channel", value: `<#${newMessage.channel.id}>` },
                { name: "Link", value: `[Go to message](${newMessage.url})` },
            )
            .setTimestamp()
            .setFooter({ text: "Made with ❤️ by zThundy" });

        return embed;
    }

    roleCreate(client, role) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`New role created`)
            .setColor(role.hexColor)
            .addFields(
                { name: "Role name", value: "```" + role.name + "```" },
                { name: "Role ID", value: "```" + role.id + "```" },
                { name: "Role color", value: "```" + role.hexColor + "```" },
                { name: "Role position", value: "```" + role.position + "```" },
            )
            .setTimestamp()
            .setFooter({ text: "Made with ❤️ by zThundy" });

        return embed;
    }

    roleDelete(client, role) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`Role deleted`)
            .setColor(role.hexColor)
            .addFields(
                { name: "Role name", value: "```" + role.name + "```" },
                { name: "Role ID", value: "```" + role.id + "```" },
                { name: "Role color", value: "```" + role.hexColor + "```" },
                { name: "Role position", value: "```" + role.position + "```" },
            )
            .setTimestamp()
            .setFooter({ text: "Made with ❤️ by zThundy" });

        return embed;
    }

    roleUpdate(client, oldRole, newRole) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`Edited role`)
            .setColor(newRole.hexColor)
            .addFields(
                { name: "Old role name", value: "```" + oldRole.name + "```", inline: false },
                { name: "New role name", value: "```" + newRole.name + "```", inline: true },
                { name: "Old role ID", value: "```" + oldRole.id + "```", inline: false },
                { name: "New role ID", value: "```" + newRole.id + "```", inline: true },
                { name: "Old role color", value: "```" + oldRole.hexColor + "```", inline: false },
                { name: "New role color", value: "```" + newRole.hexColor + "```", inline: true },
                { name: "Old role position", value: "```" + oldRole.position + "```", inline: false },
                { name: "New role position", value: "```" + newRole.position + "```", inline: true },
            )
            .setTimestamp()
            .setFooter({ text: "Made with ❤️ by zThundy" });

        return embed;
    }

    messageReactionAdd(client, reaction, user) {
        if (user.bot) return;
        if (user.id === this.userId) return;
        if (reaction.message.channel.type === "DM") return;
        if (reaction.message.channel.id === this.config.logs.channelId) return;

        const embed = new Discord.MessageEmbed()
            .setTitle(`User ***${user.tag}*** added reaction to message`)
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
            .setColor("#00ff00")
            .addFields(
                { name: "Username", value: "```" + user.username + "```" },
                { name: "Emoji", value: "```" + reaction.emoji.toString() + "```" },
                { name: "Link", value: `[Go to message](${reaction.message.url})` },
                { name: "Channel", value: `<#${reaction.message.channel.id}>` },
            )
            .setTimestamp()
            .setFooter({ text: "Made with ❤️ by zThundy" });

        return embed;
    }

    messageReactionRemove(client, reaction, user) {
        if (user.bot) return;
        if (user.id === this.userId) return;
        if (reaction.message.channel.type === "DM") return;
        if (reaction.message.channel.id === this.config.logs.channelId) return;

        const embed = new Discord.MessageEmbed()
            .setTitle(`User ***${user.tag}*** removed reaction from message`)
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
            .setColor("#ff0000")
            .addFields(
                { name: "Username", value: "```" + user.username + "```" },
                { name: "Emoji", value: "```" + reaction.emoji.toString() + "```" },
                { name: "Link", value: `[Go to message](${reaction.message.url})` },
                { name: "Channel", value: `<#${reaction.message.channel.id}>` },
            )
            .setTimestamp()
            .setFooter({ text: "Made with ❤️ by zThundy" });

        return embed;
    }

    guildMemberAdd(client, member) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`User ***${member.displayName}*** joined the server`)
            .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
            .setColor("#00ff00")
            .addFields(
                { name: "Username", value: "```" + member.displayName + "```" },
                { name: "ID", value: "```" + member.id + "```" },
            )
            .setTimestamp()
            .setFooter({ text: "Made with ❤️ by zThundy" });

        return embed;
    }

    guildMemberRemove(client, member) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`User ***${member.displayName}*** left the server`)
            .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
            .setColor("#ff0000")
            .addFields(
                { name: "Username", value: "```" + member.displayName + "```" },
                { name: "Roles", value: "```" + member.roles.cache.map(role => role.name).join(" | ") + "```" },
                { name: "ID", value: "```" + member.id + "```" },
            )
            .setTimestamp()
            .setFooter({ text: "Made with ❤️ by zThundy" });

        return embed;
    }

    guildMemberUpdate(client, oldMember, newMember) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`User ***${newMember.displayName}*** got updated`)
            .setAuthor({ name: newMember.displayName, iconURL: newMember.displayAvatarURL() })
            .setColor("#0000ff")
            .addFields(
                { name: "Old Username", value: "```" + oldMember.displayName + "```", inline: true },
                { name: "New Username", value: "```" + newMember.displayName + "```", inline: true },
                { name: "Old Roles", value: "```" + oldMember.roles.cache.map(role => role.name).join(" | ") + "```" },
                { name: "New Roles", value: "```" + newMember.roles.cache.map(role => role.name).join(" | ") + "```" },
                { name: "ID", value: "```" + newMember.id + "```" },
            )
            .setTimestamp()
            .setFooter({ text: "Made with ❤️ by zThundy" });

        return embed;
    }

    voiceStateUpdate(client, oldState, newState) {
        if (oldState.channel === null && newState.channel !== null) {
            const embed = new Discord.MessageEmbed()
                .setTitle(`User ***${newState.member.displayName}*** joined voice channel`)
                .setAuthor({ name: newState.member.displayName, iconURL: newState.member.displayAvatarURL() })
                .setColor("#00ff00")
                .addFields(
                    { name: "Username", value: "```" + newState.member.displayName + "```" },
                    { name: "Channel", value: "```" + newState.channel.name + "```" },
                    { name: "ID", value: "```" + newState.member.id + "```" },
                )
                .setTimestamp()
                .setFooter({ text: "Made with ❤️ by zThundy" });

            return embed;
        } else if (oldState.channel !== null && newState.channel === null) {
            const embed = new Discord.MessageEmbed()
                .setTitle(`User ***${oldState.member.displayName}*** left voice channel`)
                .setAuthor({ name: oldState.member.displayName, iconURL: oldState.member.displayAvatarURL() })
                .setColor("#ff0000")
                .addFields(
                    { name: "Username", value: "```" + oldState.member.displayName + "```" },
                    { name: "Channel", value: "```" + oldState.channel.name + "```" },
                    { name: "ID", value: "```" + oldState.member.id + "```" },
                )
                .setTimestamp()
                .setFooter({ text: "Made with ❤️ by zThundy" });

            return embed;
        }

        const embed = new Discord.MessageEmbed()
            .setTitle(`User ***${newState.member.displayName}*** voicestate changed`)
            .setAuthor({ name: newState.member.displayName, iconURL: newState.member.displayAvatarURL() })
            .setColor("#0000ff")
            .addFields(
                { name: "Old Channel", value: "```" + (oldState.channel ? oldState.channel.name : "None") + "```", inline: true },
                { name: "New Channel", value: "```" + (newState.channel ? newState.channel.name : "None") + "```", inline: true },
                { name: "ID", value: "```" + newState.member.id + "```" },
            )
            .setTimestamp()
            .setFooter({ text: "Made with ❤️ by zThundy" });

        return embed;
    }

    channelCreate(client, channel) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`Channel ***${channel.name}*** got created`)
            .setAuthor({ name: channel.name, iconURL: channel.guild.iconURL() })
            .setColor("#00ff00")
            .addFields(
                { name: "Channel", value: "```" + channel.name + "```" },
                { name: "ID", value: "```" + channel.id + "```" },
            )
            .setTimestamp()
            .setFooter({ text: "Made with ❤️ by zThundy" });

        return embed;
    }

    channelUpdate(client, oldChannel, newChannel) {
        if (oldChannel.name === newChannel.name && oldChannel.type === newChannel.type) return;

        const embed = new Discord.MessageEmbed()
            .setTitle(`Channel ***${newChannel.name}*** got updated`)
            .setAuthor({ name: newChannel.name, iconURL: newChannel.guild.iconURL() })
            .setColor("#0000ff")
            .addFields(
                { name: "Old Name", value: "```" + oldChannel.name + "```", inline: false },
                { name: "New Name", value: "```" + newChannel.name + "```", inline: true },
                { name: "Old Type", value: "```" + oldChannel.type + "```", inline: false },
                { name: "New Type", value: "```" + newChannel.type + "```", inline: true },
                { name: "ID", value: "```" + newChannel.id + "```" },
            )
            .setTimestamp()
            .setFooter({ text: "Made with ❤️ by zThundy" });

        return embed;
    }

    channelDelete(client, channel) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`Channel ***${channel.name}*** got deleted`)
            .setAuthor({ name: channel.name, iconURL: channel.guild.iconURL() })
            .setColor("#ff0000")
            .addFields(
                { name: "Channel", value: "```" + channel.name + "```" },
                { name: "ID", value: "```" + channel.id + "```" },
            )
            .setTimestamp()
            .setFooter({ text: "Made with ❤️ by zThundy" });

        return embed;
    }
}

module.exports = Logger;