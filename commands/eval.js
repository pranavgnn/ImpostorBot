exports.config = {
    name: "eval",
    aliases: ["evaluate"],
    options: [
        {
            name: "Type",
            description: "Either \"Shell\" or \"Code\".",
            type: 3,
            required: true,
            choices: [
                {
                    name: "Code",
                    value: "code"
                },
                {
                    name: "Shell",
                    value: "shell"
                }
            ],
        },
        {
            name: "Line",
            description: "The line you want to evaluate.",
            type: 3,
            required: true
        }
    ],
    guildOnly: false,
    staffOnly: true,
    description: "Evaluates a command on the host's system.",
    usage: "eval <Code>",
    category: "Staff Only",
};
const { exec } = require("child_process");

const clean = text => {
    if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

exports.run = async (bot, message, args) => {
    if (args[0].toLowerCase() === "code") {
        try {
            const code = args.slice(1).join(" ");
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            message.channel.send(clean(evaled), { code: "xl" });
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        };
    } else if (args[0] === "shell") {
        exec(args.slice(1).join(" "), (err, data, getter) => {
            if(err) message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
            if(getter) message.channel.send(`\`DATA\` \`\`\`xl\n${clean(getter)}\n\`\`\``);
            message.channel.send(`\`DATA\` \`\`\`xl\n${clean(data)}\n\`\`\``);
        });
    };
};
