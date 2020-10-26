exports.config = {
    name: "eval",
    aliases: ["evaluate"],
    cooldown: 0,
    guildOnly: false,
    staffOnly: true,
    description: "Evaluates a command on the host's system.",
    usage: "eval <Code>",
    category: "Staff Only",
};

const clean = text => {
    if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

exports.run = async (bot, message, args) => {
    try {
        const code = args.join(" ");
        let evaled = eval(code);

        if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);

        message.channel.send(clean(evaled), { code: "xl" });
    } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    };
};
