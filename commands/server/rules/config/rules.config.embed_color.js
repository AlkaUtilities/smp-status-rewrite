const {
    ChatInputCommandInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ButtonBuilder,
    Client,
} = require("discord.js");
const fs = require("fs");
const util = require("../utilities");

module.exports = {
    subCommand: "rules.config.embed_color",
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { options } = interaction;
        await interaction.deferReply({ ephemeral: true });
        const hexcode = options.getString("hex", true);
        try {
            const data = JSON.parse(fs.readFileSync("./config/rules.json"));

            if (!data)
                return interaction.followUp({
                    content: "Error: json is undefined.",
                });

            if (!("config" in data))
                return interaction.followUp({
                    content: "Error: key `rules` is not found in json.",
                });

            if (!("embed_color" in data.config))
                return interaction.followUp({
                    content:
                        "Error: key `embed_color` is not found in `data.config`",
                });

            const regex = /^#[0-9A-F]{6}$/i;

            if (!regex.test(hexcode))
                return interaction.followUp({
                    content: `Error: hex code is invalid.\nHex: \`${hexcode}\``,
                });

            data.config.embed_color = hexcode;

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
                "./config/rules.json",
                data,
                "Color has been changed"
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
            interaction.followUp({ content: `Error: \`\`\`${err}\`\`\`` });
            console.log(err);
        }
    },
};
