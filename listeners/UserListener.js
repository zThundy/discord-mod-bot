class Listener {
    constructor(client) {
        this.cLoader = client.modules.get("config");
        this.config = this.cLoader.get();
        this.guild = client.guilds.cache.get(this.config.guildId);
        this.minecraft = client.modules.get("minecraft");
        this.guild.channels.fetch(this.config.minecraft.verifyChannel)
            .then(channel => {  
                this.channel = channel;
            });
    }

    run(event, client, ...args) {
        switch(event) {
            case "guildMemberAdd":
                this.guildMemberAdd(client, ...args);
                break;
            case "guildMemberRemove":
                // this.guildMemberRemove(client, user);
                break;
            case "guildMemberUpdate":
                this.guildMemberUpdate(client, ...args);
                break;
        }
    }

    guildMemberAdd(client, user) {
        // find specific role and add to user
        const guild = client.guilds.cache.get(this.config.guildId);
        const role = guild.roles.cache.find(role => role.id === this.config.roleAssiger.userRole);
        // assign that role to the user
        user.roles.add(role);
    }

    guildMemberUpdate(client, oldUser, newUser) {
        // check if the role added is the one in the config file
        if (newUser.roles.cache.find(role => role.id === this.config.minecraft.role)) {
            // send a message in the channel id in the config tagging the user
            this.channel.send({ content: `<@${newUser.id}> please send your minecraft username in this channel\n\nNote: **If your username is already whitelisted you can either ignore this message or send the new one to update it.**` }).then(mainMessage => {
                // listen for the reply of the user
                const filter = m => m.author.id === newUser.id;
                // 10 mins to reply
                const collector = this.channel.createMessageCollector(filter, { time: 600000 });
                collector.on("collect", async m => {
                    collector.stop();
                        
                    // check if the message is a valid minecraft username
                    if (m.content.match(/^[a-zA-Z0-9_]{3,16}$/)) {
                        // send a message to the minecraft channel
                        m.reply(`New minecraft username submitted by <@${newUser.id}> - ${m.content}`);
                        setTimeout(() => this.channel.bulkDelete(10), 5000);
                        this.minecraft.addPlayer({ userId: newUser.id, guildId: this.config.guildId, minecraftName: m.content });
                    } else {
                        // send a message to the user
                        m.reply("Your username is invalid, please try again");
                        setTimeout(() => this.channel.bulkDelete(10), 5000);
                    }
                });
            });
        }

        // check if the role removed is the one in the config file
        if (oldUser.roles.cache.find(role => role.id === this.config.minecraft.role) && !newUser.roles.cache.find(role => role.id === this.config.minecraft.role)) {
            // remove the user from the database
            this.minecraft.removePlayer({ userId: newUser.id, guildId: this.config.guildId });
        }
    }
}

module.exports = Listener;