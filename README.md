# KalBot
is a Discord Bot designed for FFXIV Discord Servers to notify new users that join your server to change their Discord Server nickname to their FFXIV Character Name, along with several other useful tools for FFXIV Free Companies. Plays nicely with KupoBot.

KalBot was originally forked from [StrifeBot](https://github.com/jakebilbe/StrifeBot) to integrate better with KupoBot, sharing the !iam command instead of using !name to authenticate. Advanced mode has also been removed because I don't use it on my Free Company's Discord.

## Setup
Use your preferred method of obtaining this repository, open the folder in whichever Terminal application you prefer and run **npm install** to install the dependencies.

You will find a file named **auth_config.example.json**, rename this to **auth_config.json** and edit the file to your own liking.

* **Bot Token** - Your generated Bot Token [HERE](https://discordapp.com/developers/applications/me)
* **Channel** - This must be the ID of the Channel *(Settings > Appearance > Developer Mode | Right Click Channel > Copy ID)*
* **Debug Mode** - Due to the nature of the bot, there are bound to be some bugs/issues so if you are having these please enable this and contact me with a screenshot of your console
* **Default Role** - This must be the text name of the Role *(e.g. Member, Recruit, Veteran)* which will be given to any Verified users that aren't in
* **FFXIV Server Name** - Name of FFXIV world to use for instruction messages.


**PLEASE NOTE THAT THIS WILL NOT WORK FOR ANY ROLES HIGHER THAN THE BOT**

##### Required Permissions
* Manage Roles
* Manage Nicknames
* Send Messages

## Built With
* [Discord.js](https://www.npmjs.com/package/discord.js) - *discord.js is a powerful node.js module that allows you to interact with the Discord API very easily.*
