import { was } from "..";
import { Message, TextChannel, Guild, Client } from "discord.js";
import { App } from "../app";

describe("Discord Bot Message Listener", () => {
  let testMessage: Message;
  let testClient: Client;
  let guild: Guild;
  let app: App;

  testClient = new Client();
  // @ts-ignore
  app = new App(testClient, {});
  guild = new Guild(testClient, {
    emojis: []
  });
  testMessage = new Message(
    new TextChannel(guild, {}),
    {
      author: {
        id: "authorId"
      },
      embeds: [],
      attachments: []
    },
    new Client()
  );

  it("should return true if the first word in the message is !beers", () => {
    testMessage.content = "!beers two hearted ale";
    expect(was(testMessage, "!beers")).toBeTruthy();
  });

  it("should return false if it finds a command in the middle of a string", () => {
    testMessage.content = "what happens if I type !beers in the middle?";
    expect(was(testMessage, "!beers")).toBeFalsy();
  });
});
