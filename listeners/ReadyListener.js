class Listener {
    constructor(config, client) {
        this.config = config;
        this.counter = client.modules.get("userCount");
        this.cron = client.modules.get("cron");
        this.twitch = client.modules.get("twitch");

        this.channelIsLive = false;
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
        this.uid = this.cron.add(Number(this.config.twitch.checkEveryMinutes) * 60 * 1000, () => {
            this.twitch.checkStream(this.config.twitch.channelName)
                .then(r => {
                    this.twitch.updateResponse(r.res);
                    
                    if (r.data) {
                        client.guilds.fetch(this.config.guildId)
                            .then(guild => {
                                guild.channels.fetch(this.config.twitch.channelId)
                                    .then(channels => {
                                        // if the channel is not live, send the message
                                        if (!this.channelIsLive) {
                                            // update the isLive status
                                            this.channelIsLive = true;
                                            // create the embed
                                            const embed = this.twitch.getEmbed(r.data);
                                            // send the message
                                            channels.find(channel => channel.id === this.config.twitch.discordChannelId).send({ embeds: [embed] });
                                        }
                                    })
                                    .catch(console.error);
                            })
                            .catch(console.error);
                    } else {
                        this.channelIsLive = false;
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.twitch.resetToken();
                });
        }, true);
    }
}

module.exports = Listener;