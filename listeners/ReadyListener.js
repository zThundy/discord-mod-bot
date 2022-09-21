if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

class Listener {
    constructor(config, client) {
        this.config = config;
        this.counter = client.modules.get("userCount");
        this.cron = client.modules.get("cron");
        this.twitch = client.modules.get("twitch");
    }

    run(event, client) {
        client.guilds.cache.forEach(guild => {
            if (guild.id !== this.config.guildId) {
                guild.leave();
            } else {
                this.counter.update(guild);
            }
        });

        client.user.setActivity(this.config.status.message, {
            type: this.config.status.type,
            url: this.config.status.url
        });

        this._twitchCheck(client);
    }

    _twitchCheck(client) {
        setTimeout(() => {
            for (var i in this.config.twitch.channelNames) {
                this.config.twitch.channelNames[i].uuid = this.cron.add(Number(this.config.twitch.checkEveryMinutes) * 60 * 1000, () => {
                    var cacheIndex = i;
    
                    this.twitch.checkStream(this.config.twitch.channelNames[cacheIndex].name).then(stream => {
                        if (stream) {
                            client.guilds.fetch(this.config.guildId).then(guild => {
                                guild.channels.fetch(this.config.twitch.channelId).then(channels => {
                                    // if the channel is not live, send the message
                                    if (!this.config.twitch.channelNames[cacheIndex].isLive) {
                                        // update the isLive status
                                        this.config.twitch.channelNames[cacheIndex].isLive = true;
                                        // create the embed
                                        const embed = this.twitch.getEmbed(stream);
                                        // send the message
                                        if (this.config.twitch.channelNames[cacheIndex].tag) {
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
                            this.config.twitch.channelNames[cacheIndex].isLive = false;
                        }
                    }).catch((err) => {
                        console.log(err);
                        this.twitch.resetToken();
                    });
                }, true);
            }
        }, 1000);
    }
}

module.exports = Listener;