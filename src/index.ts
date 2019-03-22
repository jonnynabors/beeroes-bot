import Discord from "discord.js";
import { App } from "./app";
// when running locally, comment the above and uncomment the below
// import { App } from "./app.ts";
const client = new Discord.Client();

client.login(process.env.CLIENT_ID);
let app = new App(client);
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
