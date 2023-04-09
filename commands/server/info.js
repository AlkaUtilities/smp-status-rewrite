const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChatInputCommandInteraction,
    Client,
    IntegrationApplication,
    EmbedBuilder,
} = require("discord.js");

const config = require("../../config/config.json");

module.exports = {
    name: "info",
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Sends info embed")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption((channel) =>
            channel.setName("target").setDescription("target channel")
        ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });
        const { options } = interaction;
        const channel = options.getChannel("target");
        if (!channel.isTextBased())
            return interaction.followUp({
                content: "Channel is not a text channel",
            });

        const embed = new EmbedBuilder()
            .setTitle("Info")
            .setDescription(
                [
                    `IP Address: \`${config.smp.ip}:${config.smp.port}\``,
                    `Version: ${config.smp.version}`,
                ].join("\n")
            )
            .setColor("#009933");

        channel.send({ embeds: [embed] });
        interaction.followUp({ content: `Message sent to <#${channel.id}>` });
    },
};
