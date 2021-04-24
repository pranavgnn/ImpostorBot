exports.config = {
    name: "invite",
    guildOnly: false,
    staffOnly: false,
    description: "Sends the bot invite link in the channel.",
    usage: "invite",
    category: "Miscellaneous",
};

exports.run = async (bot, message, _, config) => {
   message.channel.send(
       "https://discord.com/api/oauth2/authorize?client_id=769552569323749376&permissions=8&scope=bot%20applications.commands"
    );
};