const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "rules",
    disabled: false, // is the command disabled?
    hasESub: true, // does the command has an external sub command?
    initialreply: false, // does command execute with an initial reply?
    developer: false, // is command developer only?
    global: true, // is the command global?
    data: new SlashCommandBuilder()
        .setName("rules")
        .setDescription("Command to manage rules")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((sub) =>
            sub
                .setName("list")
                .setDescription("Lists rules")
                .addStringOption((str) =>
                    str
                        .setName("display")
                        .setDescription("Display type")
                        .setChoices(
                            { name: "embed", value: "embed" },
                            { name: "json", value: "json" }
                        )
                )
        )
        .addSubcommand((sub) =>
            sub
                .setName("add")
                .setDescription("Adds a rule")
                .addStringOption((str) =>
                    str
                        .setName("rule")
                        .setDescription("The rule to be added")
                        .setRequired(true)
                )
                .addIntegerOption((int) =>
                    int
                        .setName("position")
                        .setDescription("Insert rule to mentioned position.")
                        .setMinValue(1)
                )
        )
        .addSubcommand((sub) =>
            sub
                .setName("remove")
                .setDescription("Removes a rule")
                .addIntegerOption((int) =>
                    int
                        .setName("position")
                        .setDescription(
                            "The position of the rule that will be removed"
                        )
                        .setMinValue(1)
                        .setRequired(true)
                )
        )
        .addSubcommand((sub) =>
            sub
                .setName("modify")
                .setDescription("Modifies a rule")
                .addIntegerOption((int) =>
                    int
                        .setName("position")
                        .setDescription(
                            "The position of the rule that will be modified"
                        )
                        .setMinValue(1)
                        .setRequired(true)
                )
                .addStringOption((str) =>
                    str
                        .setName("new_rule")
                        .setDescription(
                            "New rule to replace the rule in position"
                        )
                        .setRequired(true)
                )
        )
        .addSubcommandGroup((scg) =>
            scg
                .setName("channel")
                .setDescription("Rules configuration")
                .addSubcommand((sub) =>
                    sub
                        .setName("add")
                        .setDescription("Channel to send the embed to")
                        .addChannelOption((channel) =>
                            channel
                                .setName("channel")
                                .setDescription("Channel to send the embed to")
                                .setRequired(true)
                        )
                )
                .addSubcommand((sub) =>
                    sub
                        .setName("remove")
                        .setDescription("Removes the embed in the channel")
                        .addChannelOption((str) =>
                            str
                                .setName("channel")
                                .setDescription(
                                    "The channel where the message is in"
                                )
                                .setRequired(true)
                        )
                        .addStringOption((str) =>
                            str
                                .setName("message_id")
                                .setDescription("Message id")
                                .setRequired(true)
                        )
                )
                .addSubcommand((sub) =>
                    sub
                        .setName("update")
                        .setDescription("Updates existing rules messages")
                )
        )
        .addSubcommandGroup((scg) =>
            scg
                .setName("config")
                .setDescription("Configure stuff")
                .addSubcommand((sub) =>
                    sub
                        .setName("embed_color")
                        .setDescription("Set color of embed")
                        .addStringOption((str) =>
                            str
                                .setName("hex")
                                .setDescription("Hex code of color")
                                .setRequired(true)
                        )
                )
        ),
};
