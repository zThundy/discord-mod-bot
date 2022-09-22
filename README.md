# DiscordJs v-13.x bot

<p>
  <a href="https://github.com/zThundy/discord-bot/releases" target="_blank">
    <img alt="Version" src="https://img.shields.io/badge/version-0.1.5-blue.svg" />
  </a>
  <a href="https://twitter.com/zthundy__" target="_blank">
    <img alt="Twitter: zthundy__" src="https://img.shields.io/twitter/follow/zthundy__.svg?style=social" />
  </a>
</p>

This open source project is a node package made to have a personal discord bot to play music from youtube and spotify.

## Installation
To install everything you need, you'll have to run the command

```bash
npm install
```

## Configuration
To configure the bot, you can change the `config_template.js` or create a clone of that file called `config.js`.

## Run bot
To run the bot you will need to add your discord bot [token](https://discord.com/developers/applications) and add it to the `config.js` file as shown here:
```json
    "token": "YOUR_TOKEN_HERE",
```
Then you will need to configure the main parameters with the corresponding IDs
```json
    "userRole": "DEFAULT_ROLE_ID_HERE",
    "guildId": "YOUR_GUILD_ID_HERE",
    "adminId": "YOUR_USER_ID_HERE",
```

## Twitch integration
If you want to run the twitch announcements module, then you will need to create a twitch application from this [link](https://dev.twitch.tv/console/apps) and then add the clientID and the clientSecret in the config fields:
```json
    "clientId": "YOUR_CLIENT_ID_HERE",
    "clientSecret": "YOUR_CLIENT_SECRET_HERE",
```

Everything else is optional.

## License
[MIT](https://choosealicense.com/licenses/mit/)
