// eslint-disable-next-line node/no-unsupported-features/es-syntax
import { CommandoClient } from "discord.js-commando";
const path = require("path");
require("dotenv").config();

const client = new CommandoClient({
  commandPrefix: "!",
  invite: "https://discord.gg/5nJMzPA"
});

console.log(process.env.CLIENT_ID);
try {
  client.login(process.env.CLIENT_ID);
  client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
    client.user.setActivity("with Commando");
  });
} catch (error) {
  console.error(error);
}
