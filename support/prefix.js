const db = require(`quick.db`);

module.exports = (message, botId) => {
    var prefixes = [];
    if (message.guild) 
        prefixes = db.fetch(`prefixes_${message.guild.id}`) || [];

    prefixes.push(`<@!${botId}> `);
    prefixes.push(`<@${botId}> `);
    for (let i = 0; i < prefixes.length; i++) {
        if (message.content.startsWith(prefixes[i]))
            return prefixes[i];
    };
};