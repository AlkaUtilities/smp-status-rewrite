const { Client, ActivityType } = require("discord.js");
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
        client.user.setPresence({
            activities: [
                {
                    name: "in development",
                    type: ActivityType.Playing,
                },
            ],
            status: "idle",
        });
    },
};
