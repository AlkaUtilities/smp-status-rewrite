const {
    Client,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");

module.exports = {
    ignore: true,
    isArray,
    UpdateRules,
    CreateApplyButton,
    CreateCancelButton,
};

function isArray(a) {
    return !!a && a.constructor === Array;
}

/**
 *
 * @param {Client} client
 * @returns
 */
async function UpdateRules(client) {
    const data = JSON.parse(fs.readFileSync("./config/rules.json"));

    if (!data) return "Error: json is undefined.";

    if (!("rules" in data)) return "Error: key `rules` is not found in json.";

    if (!isArray(data.rules))
        return "Error: key `rules` in json is not an array.";

    if (!isArray(data.messages))
        return "Error: key `messages` in json is not an array.";

    const rules = new EmbedBuilder()
        .setTitle("Rules")
        .setDescription(
            data.rules
                .map((r) => `${data.rules.indexOf(r) + 1}. ${r}`)
                .join("\n") || "There are no rule."
        )
        .setColor(data.config.embed_color || "#009933");

    for (const id of data.messages) {
        const message = await client.channels.cache
            .get(id.channel)
            .messages.fetch(id.message);

        if (message.author.id !== client.user.id) return;
        message.edit({ embeds: [rules] });
    }

    return "Updated messages";
}

const fs = require("fs");

/**
 * Creates apply button, returns button builder
 * @param {Client} client
 * @param {stirng} buttonId
 * @param {stirng} filePath
 * @param {any} data
 * @returns
 */
async function CreateApplyButton(client, buttonId, filePath, data) {
    client.buttons.set(`apply${buttonId}`, {
        id: `apply${buttonId}`,
        async execute(interaction) {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
            UpdateRules(client);
            interaction.reply({
                content:
                    "Changes applied, all rules messages have been updated.",
                ephemeral: true,
            });
            client.buttons.sweep((i) => i.id.includes(buttonId));
            return;
        },
    });

    return new ButtonBuilder()
        .setCustomId(`apply${buttonId}`)
        .setLabel("Apply")
        .setEmoji({
            name: "true",
            id: "1010479956909891614",
        })
        .setStyle(ButtonStyle.Success);
}

/**
 * Creates cancel button, returns button builder
 * @param {Client} client
 * @param {string} buttonId
 * @returns
 */
async function CreateCancelButton(client, buttonId) {
    client.buttons.set(`cancel${buttonId}`, {
        id: `cancel${buttonId}`,
        async execute(interaction) {
            interaction.reply({
                content: "Changes canceled.",
                ephemeral: true,
            });
            client.buttons.sweep((i) => i.id.includes(buttonId));
            return;
        },
    });

    return new ButtonBuilder()
        .setCustomId(`cancel${buttonId}`)
        .setLabel("Cancel")
        .setEmoji({
            name: "false",
            id: "1010479954372349993",
        })
        .setStyle(ButtonStyle.Danger);
}
