var { readdirSync } = require("fs");
var ascii = require("ascii-table")

var table = new ascii().setHeading("command", "Load Status")

module.exports = (bot) => {
    readdirSync("./commands/").forEach(dir => {
        var commands = readdirSync(`./commands/${dir}/`).filter(f => f.endsWith(".js"));
        for (let file of commands)
        let pull = require(`../commands/${dir}/${file}`);
        if (pull.name){
            bot.commands.set(pull.name, pull);
            table.addRow(file, '✔️')
        } else {
            table.addRow(file, '❌ --> an error happened loading the file.');
            continue;
        }
        if (pull.aliases && Array.isArray(pull))
        pull.aliases.forEach(alias => bot.aliases.set(alias, pull.name));
    });
}