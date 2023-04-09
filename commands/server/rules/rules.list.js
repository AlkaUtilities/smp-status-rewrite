const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
    subCommand: "rules.list",
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const { options } = interaction;
        const display = options.getString("display");

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

            if (!display || display == "embed") {
                const embed = new EmbedBuilder()
                    .setTitle("Rules")
                    .setDescription(
                        data.rules
                            .map((r) => `${data.rules.indexOf(r) + 1}. ${r}`)
                            .join("\n") || "There are no rule."
                    )
                    .setColor("#009933");
                interaction.followUp({ embeds: [embed], ephemeral: true });
            } else if (display == "json") {
                interaction.followUp({
                    content: `\`\`\`json\n${JSON.stringify(
                        data,
                        null,
                        2
                    )}\n\`\`\``,
                });
            }
        } catch (err) {
            interaction.followUp(`Error: \`\`\`${err}\`\`\``);
            console.log(err);
        }
    },
};

function isArray(a) {
    return !!a && a.constructor === Array;
}
