const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");
const { clientId, guildId, token } = require("./botconfig.json");

const commands = [];
const commandPath = path.join(__dirname, "slash/commands");
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith(".js"));
for(const file of commandFiles) {
	const filePath = path.join(commandPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(token);
(async () => {
	try{
		console.log("Updating commands...");
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);
		console.log("Commands updated!");
	}
	catch(err) {
		console.error("an error happened while trying to refresh commands the commands:");
		console.error(err);
	}
})();