const request = require("request-promise");
const { MessageAttachment } = require("discord.js");

class TwitchApi {
    constructor(config, client) {
        this.config = config.twitch;
        // for now i don't need this, maybe implement some check later?
        this.currentRateLimits = 0;
        this.currentRateLimitsReset = 0;
        // number of remaining points left
        this.currentRateRemaining = 0;
        this.token = null;
        this.tokenExpires = null;
    }

    resetToken() {
        this.token = null;
        this.tokenExpires = null;
    }

    getToken() {
        return new Promise((resolve, reject) => {
            if (!this.token || this.tokenExpires < Date.now()) {
                console.log("    >> Getting new twitch token. Non existing or expired?");
                const options = {
                    method: 'POST',
                    url: 'https://id.twitch.tv/oauth2/token',
                    qs: {
                        client_id: this.config.clientID,
                        client_secret: this.config.clientSecret,
                        grant_type: 'client_credentials'
                    }
                };
                
                request(options, function (error, res, body) {
                    if (error) return reject(error);
                    body = JSON.parse(body);
                    resolve(body.access_token, body.expires_in);
                });
            } else {
                console.log("    >> Getting cached twitch token");
                resolve(this.token);
            }
        });
    }

    updateResponse(res) {
        this.res = res;

        this.currentRateLimits = res.headers['ratelimit-limit'];
        this.currentRateRemaining = res.headers['ratelimit-remaining'];
        this.currentRateLimitsReset = res.headers['ratelimit-reset'];

        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        var date = new Date(this.currentRateLimitsReset * 1000);
        var diff = Date.now() - date.getTime();

        console.log("    >> Twitch API rate limits: " + this.currentRateRemaining + "/" + this.currentRateLimits + " (reset in " + (Number(diff) * -1) + " seconds[?])");
    }

    checkStream(user) {
        return new Promise((resolve, reject) => {
            this.getToken()
                .then((token, tokenExpires) => {
                    // uydate this here cause fuck request-promise
                    this.token = token;
                    this.tokenExpires = tokenExpires;

                    const options = {
                        method: 'GET',
                        url: 'https://api.twitch.tv/helix/streams',
                        qs: { user_login: user },
                        headers: {
                            'Client-ID': this.config.clientID,
                            Authorization: 'Bearer ' + token
                        }
                    };

                    request(options, function (error, res, body) {
                        try {
                            if (error) return reject(error);
                            body = JSON.parse(body);
                            resolve({ data: body.data[0], res });
                        } catch (err) {
                            reject(err);
                        }
                    });
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    getEmbed(stream) {
        // parse it if is a string
        if (typeof stream === "string") stream = JSON.parse(stream);

        const embed = {
            title: stream.user_name + " is live!",
            url: `https://twitch.tv/${stream.user_name}`,
            color: 0x6441a5,
        };
        // if (stream.thumbnail_url) {
        //     embed.thumbnail = {
        //         url: stream.thumbnail_url.replace("{width}", "1280").replace("{height}", "720")
        //     };
        // }
        if (stream.title) {
            embed.fields = [
                { 
                    name: "Title",
                    value: stream.title || "No title",
                },
                {
                    name: "Game",
                    value: stream.game_name || "Unknown"
                },
                {
                    name: "Viewers",
                    value: String(stream.viewer_count || 0)
                }
            ];
        }
        if (stream.user_name) {
            embed.author = {
                name: stream.user_name,
                url: `https://twitch.tv/${stream.user_name}`,
                icon_url: stream.profile_image_url
            };
        }
        if (stream.thumbnail_url) {
            embed.image = {
                url: stream.thumbnail_url.replace("{width}", "1280").replace("{height}", "720")
            };
        }
        if (stream.viewer_count) {
            embed.footer = {
                text: "Made with ❤️ by zThundy__"
            };
        }

        return embed;
    }
}
module.exports = TwitchApi;