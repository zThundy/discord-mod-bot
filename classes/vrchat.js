const vrc = require('vrchat');

class VRChat {
    constructor(config, client) {
        this.cLoader = client.modules.get("config");
        this.config = this.cLoader.get();

        const apiConfig = new vrc.Configuration({
            username: this.config.vrchat.username,
            password: this.config.vrchat.password
        });

        this.auth = new vrc.AuthenticationApi(apiConfig);

        this.auth.getCurrentUser()
            .then(resp => {
                const currentUser = resp.data;
                console.log(`Logged in as: ${currentUser.displayName}`);
            });
    }
}

module.exports = VRChat;