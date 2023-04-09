const { EmbedBuilder } = require("discord.js");

module.exports = {
    id: "example", // The buttons .setCustomId

    async execute(interaction, client, args) {
        // To access an id / value from a button you MUST INCLUDE `client` AND `args` and in the same order as shown
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Example button response")
                    .setDescription(`test`)
                    .setColor("Blue"),
            ],
            ephemeral: true,
        });
    },
};
