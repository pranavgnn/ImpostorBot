const db = require(`quick.db`);

module.exports = (cmd, message) => {

    var cmdCooldown = (cmd.config.cooldown || 3) * 1000;
    var cooldownData = db.fetch(`cooldowns_${message.author.id}_${cmd.config.name}`) ||
    {
        lastUsed: message.createdTimestamp - cmdCooldown,
        streak: 0,
        totalUse: 0
    };

    var timeLeft = Math.round(((cooldownData.lastUsed + cmdCooldown) - Date.now()) / 1000);

    //In cooldown
    if ((message.createdTimestamp - cooldownData.lastUsed) < cmdCooldown) return timeLeft;

    var newData = {
        lastUsed: message.createdTimestamp,
        streak: cooldownData.streak,
        totalUse: cooldownData.totalUse + 1
    };

    if ((message.createdTimestamp - cooldownData.lastUsed) < (cmdCooldown * 1.5))
        newData.streak = newData.streak + 1;
    else
        newData.streak = 1;

    db.set(`cooldowns_${message.author.id}_${cmd.config.name}`, newData);
};