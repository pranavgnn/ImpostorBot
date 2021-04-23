module.exports = (message, botId) => {
    const prefixes = require('../config.json').PREFIXES;
    prefixes.push(`<@!${botId}> `);
    prefixes.push(`<@${botId}> `);

    for (let i = 0; i < prefixes.length; i++) {
        if (message.content.startsWith(prefixes[i]))
            return prefixes[i];
    };
};