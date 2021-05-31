module.exports = {
    name: 'guildMemberRemove',
    once: false,
    async execute(member){
        const channel = member.guild.channels.find(channel => channel.name === "welcome");
        if (!channel) {
            const channel = member.guild.channels.find(channel => channel.name === "bienvenue");
            return await farewell(member, channel);
        } else {
            return await farewell(member, channel);
        }
    }
}