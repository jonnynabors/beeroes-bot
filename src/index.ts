import Discord from "discord.js";
// @ts-ignore
import { App } from "./app.ts";
const client = new Discord.Client();

client.login(process.env.CLIENT_ID);
let app = new App(client);
app.client.on("ready", () => {
  app.readyHandler();
});

app.client.on("message", (msg: Discord.Message) => {
  if (msg.content.includes("!cheers")) {
    app.cheersHandler(msg);
  }

  if (msg.content === "!drinks") {
    app.drinkCountHandler(msg);
  }

  if (msg.content === "!whosdrunk") {
    app.whoIsDrunkHandler(msg);
  }

  if (msg.content === "!beeroes-clear") {
    app.resetBotHandler();
  }
});
