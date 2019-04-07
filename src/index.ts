import Discord from "discord.js";
import { Client } from "pg";
import { App } from "./app";
const client = new Discord.Client();

const pgClient = new Client({
  connectionString: process.env.CONNECTION_STRING
});
pgClient.connect();

client.login(process.env.CLIENT_ID);
let app = new App(client, pgClient);
app.client.on("ready", () => {
  app.readyHandler();
});

app.client.on("message", (msg: Discord.Message) => {
  msg.cleanContent;
  if (msg.content.includes("dc!cheers")) {
    app.cheersHandler(msg);
  }

  if (msg.content === "dc!drinks") {
    app.drinkCountHandler(msg);
  }

  if (msg.content === "dc!drunk") {
    app.whoIsDrunkHandler(msg);
  }

  if (msg.content === "dc!closingtime") {
    app.resetBotHandler(msg);
  }

  if (msg.content === "dc!help") {
    app.helpHandler(msg);
  }
});
