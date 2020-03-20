import Discord from "discord.js";
import { App } from "./app";
import DBL from "dblapi.js";

const client = new Discord.Client();

client.login(process.env.CLIENT_ID);
client.on("error", error =>
  console.error("An error occurred in the Discord client", error)
);

const dblAPI = new DBL(process.env.DBL_API!, client);

let app = new App(client);

app.client.on("ready", () => {
  app.readyHandler();
  setInterval(async () => {
    try {
      await dblAPI.postStats(client.guilds.size);
      console.log(
        "Successfully updated DBL with a guild count of ",
        client.guilds.size
      );
    } catch (error) {
      console.log("Error posting stats to DBL", error);
    }
  }, 1800000);
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

app.client.on("error", error =>
  console.error("Another error occurred in maybe the same place", error)
);

export function was(msg: Discord.Message, command: string) {
  // Only look for a command at the beginning of a message
  return msg.content
    .split(" ")[0]
    .toLowerCase()
    .includes(command);
}
