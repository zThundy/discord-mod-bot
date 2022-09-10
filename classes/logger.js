const Discord = require("discord.js");

class Logger {
    constructor(config, client) {
        this.config = config;
        this.guild = client.guilds.cache.get(config.guildId)
        this.guild.channels.fetch(config.logs.channelId)
            .then(channel => {  
                this.channel = channel;
            });
        this.userId = client.user.id;
    }

    run(event, ...args) {
        console.log("    >> Calling logger for: " + event);
        if (!this.config.logs.enabled) return;
        if (!this[event]) return;

        var message = this[event](...args);
        if (!message) return;
        this.channel.send({ embeds: [message] });
    }

    messageCreate(client, message) {
        if (message.author.bot) return;
        if (message.author.id === this.userId) return;
        if (message.channel.type === "DM") return;
        if (message.channel.id === this.config.logs.channelId) return;

        const embed = new Discord.MessageEmbed()
            .setTitle(`Message sent by ***${message.author.tag}*** in ***${message.channel.name}***`)
            .setColor("#00ff00")
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
            .addFields(
                { name: "Message", value: "```" + message.content + "```" },
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

        const embed = new Discord.MessageEmbed()
            .setTitle(`Message deleted by ***${message.author.tag}*** in ***${message.channel.name}***`)
            .setColor("#ff0000")
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
            .addFields(
                { name: "Message", value: "```" + message.content + "```" },
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

        const embed = new Discord.MessageEmbed()
            .setTitle(`Message edited by ***${newMessage.author.tag}*** in ***${newMessage.channel.name}***`)
            .setColor("#0000ff")
            .setAuthor({ name: oldMessage.author.username, iconURL: oldMessage.author.displayAvatarURL() })
            .addFields(
                { name: "Old Message", value: "```" + oldMessage.content + "```" },
                { name: "New Message", value: "```" + newMessage.content + "```" },
                { name: "Channel", value: `<#${newMessage.channel.id}>` },
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
                { name: "Old role name", value: "```" + oldRole.name + "```", inline: true },
                { name: "New role name", value: "```" + newRole.name + "```", inline: true },
                { name: "Old role ID", value: "```" + oldRole.id + "```", inline: true },
                { name: "New role ID", value: "```" + newRole.id + "```", inline: true },
                { name: "Old role color", value: "```" + oldRole.hexColor + "```", inline: true },
                { name: "New role color", value: "```" + newRole.hexColor + "```", inline: true },
                { name: "Old role position", value: "```" + oldRole.position + "```", inline: true },
                { name: "New role position", value: "```" + newRole.position + "```", inline: true },
            )
            .setTimestamp()
            .setFooter({ text: "Made with ❤️ by zThundy" });

        return embed;
    }

    messageReactionAdd(client, reaction, user) {
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
}

module.exports = Logger;