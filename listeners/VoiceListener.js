class Listener {
    constructor(client) {
        this.cLoader = client.modules.get("config");
        this.config = this.cLoader.get();
        this.hoursCounter = client.modules.get("hourCounter");
    }

    run(event, oldState, newState) {
        if (event === "voiceStateUpdate") {
            this.hoursCounter.checkVoiceState(oldState, newState);
        }
    }
}

module.exports = Listener;