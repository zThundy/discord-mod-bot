const https = require("https");

class WordFilter {
    constructor(config, client) {
        this.words = [];

        const request = {
            hostname: "raw.githubusercontent.com",
            port: 443,
            path: "/turalus/encycloDB/master/Dirty%20Words/DirtyWords.json",
            method: "GET"
        }

        var _data = "";
        this.req = https.request(request, res => {
            if (res.statusCode !== 200) return console.error("Request failed with status code: ", res.statusCode); 
            res.on("data", d => { _data += d });
            res.on("end", () => {
                var _words = JSON.parse(_data).RECORDS;
                for (var i in _words) {
                    this.words.push(_words[i].word);  
                }
                console.log("Loaded " + this.words.length + " words");
            });
        });

        this.req.on("error", error => {
            console.error(error);
        }).end();
    }

    checkMessage(message) {
        for (var i in this.words) {
            if (message.content.toLowerCase().includes(this.words[i].toLowerCase())) {
                message.reply("Please don't use that word.")
                    .then(msg => {
                        setTimeout(() => msg.delete(), 5000);
                    });
                message.delete();
                return false;
            }
        }
        return true;
    }
}

module.exports = WordFilter;