const https = require("https");
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

    // function to get the oauth token using https module
    getToken() {
        return new Promise((resolve, reject) => {
            if (this.token && this.tokenExpires > Date.now()) {
                console.log("    >> Using cached token");
                resolve(this.token);
            } else {
                console.log("    >> Getting new token");
                const data = JSON.stringify({
                    client_id: this.config.clientId,
                    client_secret: this.config.clientSecret,
                    grant_type: "client_credentials"
                });
                const options = {
                    hostname: "id.twitch.tv",
                    port: 443,
                    path: "/oauth2/token",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Content-Length": data.length
                    }
                };
                const req = https.request(options, res => {
                    res.on("data", d => {
                        const parsed = JSON.parse(d);
                        this.token = parsed.access_token;
                        this.tokenExpires = Date.now() + (parsed.expires_in * 1000);
                        resolve(this.token);
                    });
                });
                req.on("error", error => {
                    reject(error);
                });
                req.write(data);
                req.end();
            }
        });
    }

    checkStream(name) {
        return new Promise((resolve, reject) => {
            this.getToken().then(token => {
                const options = {
                    hostname: "api.twitch.tv",
                    port: 443,
                    path: `/helix/streams?user_login=${name}`,
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Client-Id": this.config.clientId
                    }
                };
                const req = https.request(options, res => {
                    this.updateResponse(res);
                    res.on("data", d => {
                        const parsed = JSON.parse(d);
                        if (parsed.data.length > 0) {
                            resolve(parsed.data[0]);
                        } else {
                            resolve(null);
                        }
                    });
                });
                req.on("error", error => {
                    reject(error);
                });
                req.end();
            });
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