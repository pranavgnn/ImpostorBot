exports.botGuild = "719558358776152065";

exports.channels = {
    "data-backup": "746357583115321384",
};

exports.emojis = {

};

exports.getChannel = (bot, id) => {
    return bot.channels.cache.get(id);
};

exports.getGuild = (bot, id) => {
    return bot.guilds.cache.get(id);
};

exports.getMember = (bot, id) => {
    return bot.users.cache.get(id);
};