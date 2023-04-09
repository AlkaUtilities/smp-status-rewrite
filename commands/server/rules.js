const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    name: "rules",
    disabled: false, // is the command disabled?
    hasESub: true, // does the command has an external sub command?
    initialreply: false, // does command execute with an initial reply?
    developer: true, // is command developer only?
    global: false, // is the command global?
    data: new SlashCommandBuilder()
        .setName("rules")
        .setDescription("Command to manage rules")
        .setDMPermission(false)
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
        ),
};
