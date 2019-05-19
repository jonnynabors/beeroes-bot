import Discord from "discord.js";
import { Client } from "pg";
import { App } from "./app";
import DBL from "dblapi.js";
const client = new Discord.Client();

const pgClient = new Client({
  connectionString: process.env.DATABASE_URL
});
pgClient.connect();

client.login(process.env.CLIENT_ID);
let app = new App(client, pgClient);
let dblAPI = new DBL(process.env.DBL_API!, client);

app.client.on("ready", () => {
  app.readyHandler();
  setInterval(() => {
    try {
      dblAPI.postStats(client.guilds.size, client.shard.id, client.shard.count);
      console.log("Successfully posted stats to Discord Bot List");
    } catch (error) {
      console.log("Error posting stats to Discord Bot List", error);
    }
  }, 1800000); // 30 minutes
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

export function was(msg: Discord.Message, command: string) {
  // Only look for a command at the beginning of a message
  return msg.content
    .split(" ")[0]
    .toLowerCase()
    .includes(command);
}
