if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

class Listener {
    constructor(client) {
        this.cLoader = client.modules.get("config");
        this.config = this.cLoader.get();
        this.counter = client.modules.get("userCount");
        this.cron = client.modules.get("cron");
        this.twitch = client.modules.get("twitch");
    }

    run(event, client) {
        client.guilds.cache.forEach(guild => {
            if (guild.id !== this.config.guildId) {
                guild.leave();
            }
        });

        client.user.setActivity(this.config.status.message, {
            type: this.config.status.type,
            url: this.config.status.url
        });

        if (this.config.twitch.enabled) this._twitchCheck(client);
        if (this.config.userCount.enabled) this._couterCheck(client);
    }

    _couterCheck(client) {
        this.config.userCount.uuid = this.cron.add(Number(this.config.userCount.checkEveryMinutes) * 60 * 1000, (uid) => {
            this.counter.run();
        }, true);
    }

    _twitchCheck(client) {
        setTimeout(() => {
            for (var i in this.config.twitch.channelNames) {
                this.config.twitch.channelNames[i].uuid = this.cron.add(Number(this.config.twitch.checkEveryMinutes) * 60 * 1000, (uid) => {
                    this.twitch.checkStream(this.config.twitch.channelNames[uid].name).then(stream => {
                        if (stream) {
                            client.guilds.fetch(this.config.guildId).then(guild => {
                                guild.channels.fetch(this.config.twitch.channelId).then(channels => {
                                    // if the channel is not live, send the message
                                    if (!this.config.twitch.channelNames[uid].isLive) {
                                        // update the isLive status
                                        this.config.twitch.channelNames[uid].isLive = true;
                                        // create the embed
                                        const embed = this.twitch.getEmbed(stream);
                                        // send the message
                                        if (this.config.twitch.channelNames[uid].tag) {
                                            channels.find(channel => channel.id === this.config.twitch.discordChannelId)
                                                .send({
                                                    content: this.config.twitch.defaultMessage.format(stream.user_name) + "<@&" + this.config.twitch.tagRole + ">",
                                                    embeds: [embed]
                                                });
                                        } else {
                                            channels.find(channel => channel.id === this.config.twitch.discordChannelId)
                                                .send({
                                                    content: this.config.twitch.defaultMessage.format(stream.user_name),
                                                    embeds: [embed]
                                                });
                                        }
                                    }
                                }).catch(console.error);
                            }).catch(console.error);
                        } else {
                            this.config.twitch.channelNames[uid].isLive = false;
                        }
                    }).catch((err) => {
                        console.log(err);
                        this.twitch.resetToken();
                    });
                });

                this.config.twitch.channelNames[this.config.twitch.channelNames[i].uuid] = this.config.twitch.channelNames[i];
            }
        }, 1000);
    }
}

module.exports = Listener;