const { Client, ActivityType } = require("discord.js");
const { load_commands } = require("../../handlers/command");
const { load_buttons } = require("../../handlers/button");

module.exports = {
    name: "ready",
    once: true,
    /**
     *
     * @param {Client} client
     */
    execute(client) {
        console.log(`[CLIENT] Logged in as ${client.user.tag}`);
        load_commands(client, process.argv[2] === "global" ? true : false);
        load_buttons(client);
        // client.user.setPresence({
        //     activities: [
        //         {
        //             name: "in development",
        //             type: ActivityType.Playing,
        //         },
        //     ],
        //     status: "idle",
        // });
    },
};
