const dotenv = require("dotenv");
dotenv.config();

const { Client, IntentsBitField, Partials, Collection } = require("discord.js");

const { status } = require("minecraft-server-util");
const express = require("express");

const config = require("./config/config.json");
const { load_events } = require("./handlers/event");
const { load_commands } = require("./handlers/command");
const { load_buttons } = require("./handlers/button");

const { GuildMessages, Guilds, GuildMembers } = IntentsBitField.Flags;
const { User, Message, GuildMember, ThreadMember } = Partials;

const app = express();

const client = new Client({
    intents: [GuildMessages, Guilds, GuildMembers],
    partials: [User, Message, GuildMember, ThreadMember],
});

// Collections (Discord.Collection)
client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();
client.buttons = new Collection();

app.get("/", (req, res) => {
    // returns 500 if client isn't logged in.
    if (client.user === null) return res.sendStatus(500);
    res.sendStatus(200);
});

app.listen(config.port, () =>
    console.log(`[EXPRESS] Listening on port ${config.port}`)
);

client.login(process.env.TOKEN).then(() => {
    load_events(client);
    load_commands(client);
    load_buttons(client);
});
