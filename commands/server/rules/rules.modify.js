const {
    ChatInputCommandInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const fs = require("fs");

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
                .setColor("#009933");
            const embed2 = new EmbedBuilder()
                .setTitle(`Modified rule ${position}`)
                .setDescription(
                    `from \`\`\`${currentRule}\`\`\` to \`\`\`${new_rule}\`\`\``
                )
                .setColor("#009933");

            const buttonApply = {
                id: `apply${buttonId}`,
                async execute(interaction) {
                    fs.writeFileSync(
                        "./config/rules.json",
                        JSON.stringify(data, null, 4)
                    );
                    interaction.reply({
                        content: "Changes applied",
                        ephemeral: true,
                    });
                    client.buttons.sweep((i) => i.id.includes(buttonId));
                    return;
                },
            };

            const buttonCancel = {
                id: `cancel${buttonId}`,
                async execute(interaction) {
                    interaction.reply({
                        content: "Changes canceled",
                        ephemeral: true,
                    });
                    client.buttons.sweep((i) => i.id.includes(buttonId));
                    return;
                },
            };

            client.buttons.set(buttonApply.id, buttonApply);
            client.buttons.set(buttonCancel.id, buttonCancel);

            return interaction.followUp({
                embeds: [embed, embed2],
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId(`apply${buttonId}`)
                            .setLabel("Apply")
                            .setEmoji({
                                name: "true",
                                id: "1010479956909891614",
                            })
                            .setStyle(ButtonStyle.Success),

                        new ButtonBuilder()
                            .setCustomId(`cancel${buttonId}`)
                            .setLabel("Cancel")
                            .setEmoji({
                                name: "false",
                                id: "1010479954372349993",
                            })
                            .setStyle(ButtonStyle.Danger)
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
