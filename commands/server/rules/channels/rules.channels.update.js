const {
    ChatInputCommandInteraction,
    EmbedBuilder,
    Client,
} = require("discord.js");
const fs = require("fs");

module.exports = {
    subCommand: "rules.channel.update",
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { options } = interaction;
        await interaction.deferReply({ ephemeral: true });
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

            if (!isArray(data.messages)) {
                return interaction.followUp({
                    content: "Error: key `messages` in json is not an array",
                });
            }

            const rules = new EmbedBuilder()
                .setTitle("asdsdf")
                .setDescription(
                    data.rules
                        .map((r) => `${data.rules.indexOf(r) + 1}. ${r}`)
                        .join("\n") || "There are no rule."
                )
                .setColor(data.config.embed_color || "#009933");

            for (const id of data.messages) {
                const message = await client.channels.cache
                    .get(id.channel)
                    .messages.fetch(id.message);

                message.edit({ embeds: [rules] });
            }

            interaction.followUp(`Message updated`);
        } catch (err) {
            interaction.followUp({ content: `Error: \`\`\`${err}\`\`\`` });
            console.log(err);
        }
    },
};

function isArray(a) {
    return !!a && a.constructor === Array;
}
