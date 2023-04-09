const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} = require("discord.js");

module.exports = {
    name: "ping",
    disabled: false, // is the command disabled?
    hasESub: false, // does the command has an external sub command?
    initialReply: false, // does command execute with an initial reply?
    developer: true, // is command developer only?
    global: false, // is the command global?
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong!"),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction, client) {
        interaction.reply({
            content: "Pong! Rewritten in Javascript",
            ephemeral: true,
        });
        console.log(client.buttons);
    },
};
