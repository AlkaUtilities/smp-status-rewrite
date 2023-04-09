const { Client } = require("discord.js");
const { load_commands } = require("../../handlers/command");

module.exports = {
    name: "ready",
    once: true,
    /**
     *
     * @param {Client} client
     */
    execute(client) {
        console.log(`[CLIENT] Logged in as ${client.user.tag}`);
    },
};
