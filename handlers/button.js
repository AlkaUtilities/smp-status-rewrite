/*
=============================================
      - By Ollie.
=============================================
*/

const { Client } = require("discord.js");
const { load_files } = require("../functions/file_loader");
const Table = require("cli-table");
const chalk = require("chalk");
const config = require("../config/config.json");

/**
 *
 * @param {Client} client
 * @returns
 */
async function load_buttons(client) {
    const table = new Table({
        head: ["Button ID", "Status"].map((str) => chalk.reset(str)),
        colWidths: [26, 11],
        chars: {
            mid: "",
            "left-mid": "",
            "mid-mid": "",
            "right-mid": "",
        },
    });

    await client.buttons.clear();

    const files = await load_files("buttons");

    for (const file of files) {
        const button = require(file);
        if (!button.id) return;

        client.buttons.set(button.id, button);
        table.push([button.id, config.cli.status_ok]);
    }

    console.log(table.toString());
}

module.exports = { load_buttons };
