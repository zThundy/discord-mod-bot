const fs = require("fs");

class Config {
    constructor() {
        try {
            this.config = fs.readFileSync("config.json", "utf8");
        } catch(_) {
            this.config = fs.readFileSync("config_template.json", "utf8");
        }
        if (this.config) this.config = JSON.parse(this.config);
    }

    getConfig() {
        return this.config;
    }
}

module.exports = Config;