exports.config = {
    name: "invite",
    guildOnly: false,
    staffOnly: false,
    description: "Sends the bot invite link in the channel.",
    usage: "invite",
    category: "Miscellaneous",
};

exports.run = async (bot, message, _, config) => {
   message.channel.send("https://discord.com/oauth2/authorize?client_id=769552569323749376&scope=bot&permissions=8")
};