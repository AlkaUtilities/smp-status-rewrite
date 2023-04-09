const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
    subCommand: "rules.channel.add",
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options } = interaction;
        await interaction.deferReply({ ephemeral: true });
        const channel = options.getChannel("channel", true);
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
                    content: "Error: key `messages` is not found in json",
                });
            }

            if (!isArray(data.messages)) {
                return interaction.followUp({
                    content: "Error: key `messages` in json is not an array",
                });
            }

            const rules = new EmbedBuilder()
                .setTitle("Rules")
                .setDescription(
                    data.rules
                        .map((r) => `${data.rules.indexOf(r) + 1}. ${r}`)
                        .join("\n") || "There are no rule."
                )
                .setColor(data.config.embed_color || "#009933");

            const message = await channel.send({ embeds: [rules] });

            data.messages.push({ channel: channel.id, message: message.id });
            fs.writeFileSync(
                "./config/rules.json",
                JSON.stringify(data, null, 4)
            );

            interaction.followUp(`Message sent to <#${channel.id}>`);
        } catch (err) {
            interaction.followUp({ content: `Error: \`\`\`${err}\`\`\`` });
            console.log(err);
        }
    },
};

function isArray(a) {
    return !!a && a.constructor === Array;
}
