const {
    ChatInputCommandInteraction,
    EmbedBuilder,
    Client,
} = require("discord.js");
const fs = require("fs");

module.exports = {
    subCommand: "rules.channel.remove",
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { options } = interaction;
        await interaction.deferReply({ ephemeral: true });
        const channel = options.getChannel("channel", true);
        const messageId = options.getString("message_id", true);
        try {
            const data = JSON.parse(fs.readFileSync("./config/rules.json"));

            if (!data)
                return interaction.followUp({
                    content: "Error: json is undefined.",
                });

            if (!("rules" in data))
                return interaction.followUp({
                    content: "Error: key `rules` is not found in json.",
                });

            if (!isArray(data.rules))
                return interaction.followUp({
                    content: "Error: key `rules` in json is not an array.",
                });

            if (!channel.isTextBased())
                return interaction.followUp({
                    content: "Error: specified channel is not a text channel",
                });

            if (!("messages" in data)) {
                return interaction.followUp({
                    content: "Error: key `channels` is not found in json",
                });
            }

            if (!isArray(data.messages)) {
                return interaction.followUp({
                    content: "Error: key `channels` in json is not an array",
                });
            }

            if (
                !data.messages.includes({
                    channel: channel.id,
                    message: messageId,
                })
            )
                return interaction.followUp({
                    content: "Error: message id is not in list",
                });

            const message = await interaction.guild.channels.cache
                .get(channel.id)
                .messages.fetch(messageId);

            message?.delete();

            data.messages.splice(data.messages.indexOf(message.id), 1);
            fs.writeFileSync(
                "./config/rules.json",
                JSON.stringify(data, null, 4)
            );

            interaction.followUp({ content: "Message deleted." });
        } catch (err) {
            interaction.followUp({ content: `Error: \`\`\`${err}\`\`\`` });
            console.log(err);
        }
    },
};

function isArray(a) {
    return !!a && a.constructor === Array;
}
