import {
  User,
  Client,
  DiscordAPIError,
  Message,
  TextChannel,
  Guild
} from "discord.js";
import { App } from "../app";
// TODO: work on tests
describe("Beeroes Bot", () => {
  let testClient: Client;
  let app: App;

  beforeEach(() => {
    testClient = new Client();
    app = new App(testClient);
  });

  it("should emit a successful message when the app starts", () => {
    console.log = jest.fn();
    app.readyHandler();
    expect(console.log).toHaveBeenCalledWith("I am alive and well!");
  });

  it("should emit a cheers emoji when the cheers handler is called", () => {
    let guild = new Guild(testClient, {
      emojis: []
    });
    let textChannel = new TextChannel(guild, {});
    textChannel.send = jest.fn();
    let testMessage: Message;
    testMessage = new Message(
      textChannel,
      {
        author: {
          id: "authorId"
        },
        embeds: [],
        attachments: []
      },
      testClient
    );
    testMessage.content = "!cheers";
    app.cheersHandler(testMessage);

    expect(textChannel.send).toHaveBeenCalledWith(
      "Enjoy that brewchacho, brochacho. 🍺"
    );
  });
});
