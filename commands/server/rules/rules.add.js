const {
    ChatInputCommandInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const fs = require("fs");
const util = require("./utilities");

module.exports = {
    subCommand: "rules.add",
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options } = interaction;
        await interaction.deferReply({ ephemeral: true });
        const rule = options.getString("rule", true);
        const position = options.getInteger("position");
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

            // If position is undefined, put it at the end of the list
            // else put it on the mentioned position
            if (!position) {
                data.rules.push(rule);
            } else {
                data.rules.splice(position - 1, 0, rule);
            }

            const buttonId = interaction.id;

            const embed = new EmbedBuilder()
                .setTitle("Preview")
                .setDescription(
                    data.rules
                        .map((r) => `${data.rules.indexOf(r) + 1}. ${r}`)
                        .join("\n") || "There are no rule."
                )
                .setColor(data.config.embed_color || "#009933");

            const applyButton = await util.CreateApplyButton(
                client,
                buttonId,
                data
            );
            const cancelButton = await util.CreateCancelButton(
                client,
                buttonId
            );

            return interaction.followUp({
                embeds: [embed],
                components: [
                    new ActionRowBuilder().addComponents(
                        applyButton,
                        cancelButton
                    ),
                ],
            });
        } catch (err) {
            interaction.followUp({
                content: `Error: \`\`\`${err}\`\`\``,
            });
            console.log(err);
            return;
        }
    },
};

function isArray(a) {
    return !!a && a.constructor === Array;
}
