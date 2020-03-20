import Discord from "discord.js";
import { App } from "./app";

const client = new Discord.Client();

client.login(process.env.CLIENT_ID);

let app = new App(client);

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

export function was(msg: Discord.Message, command: string) {
  // Only look for a command at the beginning of a message
  return msg.content
    .split(" ")[0]
    .toLowerCase()
    .includes(command);
}
