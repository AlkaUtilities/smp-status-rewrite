const { ButtonInteraction } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    friendlyName: "buttonListener",
    /**
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (!interaction.isButton()) return;
        const customId = interaction.customId.split("_");
        const button = client.buttons.get(customId[0]);

        if (!button) return;

        button.execute(interaction, client);
    },
};
