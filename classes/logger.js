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
        if (message.author.id === this.userId) return;
        if (message.channel.type === "DM") return;
        if (message.channel.id === this.config.logs.channelId) return;

        const embed = new Discord.MessageEmbed()
            .setTitle(`Message sent by ***${message.author.tag}*** in ***${message.channel.name}***`)
            .setColor("#00ff00")
            .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
            .addFields(
                { name: "Message", value: "```" + message.content + "```" },
                { name: "Link", value: `[Go to message](${message.url})` },
                { name: "Channel", value: `<#${message.channel.id}>` },
            )
            .setTimestamp();

        return embed;
    }

    messageDelete(client, message) {
        if (message.author.id === this.userId) return;
        if (message.channel.type === "DM") return;
        if (message.channel.id === this.config.logs.channelId) return;

        const embed = new Discord.MessageEmbed()
            .setTitle(`Message deleted by ***${message.author.tag}*** in ***${message.channel.name}***`)
            .setColor("#ff0000")
            .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
            .addFields(
                { name: "Message", value: "```" + message.content + "```" },
                { name: "Channel", value: `<#${message.channel.id}>` },
            )
            .setTimestamp();

        return embed;
    }

    messageUpdate(client, oldMessage, newMessage) {
        if (newMessage.author.id === this.userId) return;
        if (newMessage.channel.type === "DM") return;
        if (newMessage.channel.id === this.config.logs.channelId) return;

        const embed = new Discord.MessageEmbed()
            .setTitle(`Message edited by ***${newMessage.author.tag}*** in ***${newMessage.channel.name}***`)
            .setColor("#0000ff")
            .setAuthor({ name: oldMessage.author.username, iconURL: oldMessage.author.avatarURL() })
            .addFields(
                { name: "Old Message", value: "```" + oldMessage.content + "```" },
                { name: "New Message", value: "```" + newMessage.content + "```" },
                { name: "Channel", value: `<#${newMessage.channel.id}>` },
            )
            .setTimestamp();

        return embed;
    }
}

module.exports = Logger;