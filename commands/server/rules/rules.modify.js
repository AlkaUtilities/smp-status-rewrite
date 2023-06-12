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
    subCommand: "rules.modify",
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options } = interaction;
        await interaction.deferReply({ ephemeral: true });
        const position = options.getInteger("position", true);
        const new_rule = options.getString("new_rule", true);
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

            if (data.rules.length > position)
                return interaction.followUp({
                    content: `Error: the specified position cannot be greater than the rules length.\nPosition: \`${position}\``,
                });

            // If position is undefined, put it at the end of the list
            // else put it on the mentioned position
            const currentRule = data.rules[position - 1];
            data.rules[position - 1] = new_rule;

            const buttonId = interaction.id;

            const embed = new EmbedBuilder()
                .setTitle("Preview")
                .setDescription(
                    data.rules
                        .map((r) => `${data.rules.indexOf(r) + 1}. ${r}`)
                        .join("\n") || "There are no rule."
                )
                .setColor(data.config.embed_color || "#009933");
            const embed2 = new EmbedBuilder()
                .setTitle(`Modified rule ${position}`)
                .setDescription(
                    `from \`\`\`${currentRule}\`\`\` to \`\`\`${new_rule}\`\`\``
                )
                .setColor(data.config.embed_color || "#009933");

            const applyButton = await util.CreateApplyButton(
                client,
                buttonId,
                "./config/rules.json",
                data,
                "Rule has been modified"
            );
            const cancelButton = await util.CreateCancelButton(
                client,
                buttonId
            );

            return interaction.followUp({
                embeds: [embed, embed2],
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
