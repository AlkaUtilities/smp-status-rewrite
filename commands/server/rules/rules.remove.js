const {
    ChatInputCommandInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const fs = require("fs");

module.exports = {
    subCommand: "rules.remove",
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options } = interaction;
        await interaction.deferReply({ ephemeral: true });
        const postion = options.getInteger("position");
        try {
            const data = JSON.parse(fs.readFileSync("./config/rules.json"));

            if (!data)
                return interaction.followUp({
                    content: "Error: json is undefined",
                });

            if (!("rules" in data))
                return interaction.followUp({
                    content: "Error: key `rules` is not found in json",
                });

            if (!isArray(data.rules))
                return interaction.followUp({
                    content: "Error: key `rules` in json is not an array",
                });

            // If position is undefined, put it at the end of the list
            // else put it on the mentioned position
            data.rules.splice(postion - 1, 1);

            const buttonId = interaction.id;

            const embed = new EmbedBuilder()
                .setTitle("Preview")
                .setDescription(
                    data.rules
                        .map((r) => `${data.rules.indexOf(r) + 1}. ${r}`)
                        .join("\n") || "There are no rules"
                )
                .setColor("#009933")
                .setTimestamp();

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
                embeds: [embed],
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
