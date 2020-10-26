exports.config = {
    name: "ping",
    cooldown: 3,
    guildOnly: false,
    staffOnly: false,
    description: "Mentions the bot's and the API's current latency. Also used to check if the bot is alive.",
    usage: "ping",
    category: "Miscellaneous",
};

exports.run = async (bot, message, _, config) => {
    const m = await message.channel.send({ embed: { title: 'Ping?', color: config.COLOR } });
    var embed = {
        embed: {
            title: '🏓 Pong!',
            color: config.COLOR,
            description: `API Latency: \` ${m.createdTimestamp - message.createdTimestamp}ms \`\nBot Latency: \` ${bot.ws.ping}ms \``,
        }
    };
    m.edit(embed);
};