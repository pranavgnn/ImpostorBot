module.exports = (argument, guild) => {
    if (!argument) return;
    var id = argument;
    if (id.startsWith('<@')) {
        id = argument.slice(2, argument.length - 1);
        if (id.startsWith('!')) id = id.slice(1);
    };
    var user = guild.members.cache.find(m => m.id === id || m.user.tag.toLowerCase() === id.toLowerCase());
    if (!user) return;
    else return user;
};