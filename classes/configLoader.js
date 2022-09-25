const fs = require("fs");

class Config {
    constructor() {
        this.reload();
    }

    reload() {
        try {
            this.using = "config.json";
            this.config = fs.readFileSync(this.using, "utf8");
        } catch(_) {
            this.using = "config_template.json";
            this.config = fs.readFileSync(this.using, "utf8");
        }
        if (this.config) this.config = (JSON.parse(this.config));
    }

    get() {
        return this.config;
    }

    set(value, ...args) {
        if (args.length === 0) return console.error("No arguments provided for config.set()");
        if (args.length > 4) return console.error("Too many arguments provided for config.set()");

        // not good, but not bothered enough to do better
        if (args.length === 1) {
           this.config[args[0]] = value;
        } else if (args.length === 2) {
            this.config[args[0]][args[1]] = value;
        } else if (args.length === 3) {
            this.config[args[0]][args[1]][args[2]] = value;
        } else if (args.length === 4) {
            this.config[args[0]][args[1]][args[2]][args[3]] = value;
        }

        fs.writeFileSync(this.using, JSON.stringify(this.config, null, 4));
    }
}

module.exports = Config;