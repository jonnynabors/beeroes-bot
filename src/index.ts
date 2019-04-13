import Discord from "discord.js";
import { Client } from "pg";
import { App } from "./app";
const client = new Discord.Client();

const pgClient = new Client({
  connectionString: process.env.DATABASE_URL
});
pgClient.connect();

client.login(process.env.CLIENT_ID);
let app = new App(client, pgClient);
app.client.on("ready", () => {
  app.readyHandler();
});

app.client.on("message", (msg: Discord.Message) => {
  msg.cleanContent;
  if (was(msg, "!cheers")) {
    app.cheersHandler(msg);
  }

  if (was(msg, "!drinks")) {
    app.drinkCountHandler(msg);
  }

  if (was(msg, "!drunk")) {
    app.whoIsDrunkHandler(msg);
  }

  if (was(msg, "!closingtime")) {
    app.resetBotHandler(msg);
  }

  if (was(msg, "!db-help")) {
    app.helpHandler(msg);
  }

  if (was(msg, "!beers")) {
    app.beerHandler(msg);
  }
});

function was(msg: Discord.Message, command: string) {
  return msg.content.toLowerCase().includes(command);
}
