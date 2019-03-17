import {
  User,
  Client,
  DiscordAPIError,
  Message,
  TextChannel,
  Guild
} from "discord.js";
import { App } from "../app";

describe("Beeroes Bot", () => {
  let testClient: Client;
  let guild: Guild;
  let textChannel: TextChannel;
  let testMessage: Message;
  let app: App;

  beforeEach(() => {
    testClient = new Client();
    app = new App(testClient);
    guild = new Guild(testClient, {
      emojis: []
    });
    textChannel = new TextChannel(guild, {});
    textChannel.send = jest.fn();
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
  });

  it("should emit a successful message when the app starts", () => {
    console.log = jest.fn();
    app.readyHandler();
    expect(console.log).toHaveBeenCalledWith("I am alive and well!");
  });

  it("should emit a cheers emoji when the cheers handler is called", () => {
    testMessage.content = "!cheers";
    app.cheersHandler(testMessage);

    expect(textChannel.send).toHaveBeenCalledWith(
      "Enjoy that brewchacho, brochacho. 🍺"
    );
  });

  it("should emit the amount of beers drank by the server", () => {
    testMessage.content = "!cheers a beer";
    app.cheersHandler(testMessage);
    testMessage.content = "!cheers a vodka";
    app.cheersHandler(testMessage);

    app.drinkCountHandler(testMessage);
    expect(textChannel.send).toHaveBeenLastCalledWith(
      "2 drink(s) have been consumed by the server! 🍻🥃"
    );
  });

  it("should emit a message saying the server is sober if nobody has had anything to drink", () => {
    app.whoIsDrunkHandler(testMessage);
    expect(textChannel.send).toHaveBeenCalledWith(
      "Nobody is drunk because nobody has had anything to drink! 🏝️"
    );
  });

  it("should emit a message saying who has drank what drinks", () => {
    let firstUser = new User(testClient, {
      username: "Corrupting"
    });
    let secondUser = new User(testClient, {
      username: "Zeekin"
    });
    testMessage.author = firstUser;
    testMessage.content = "!cheers Lite Beer";
    app.cheersHandler(testMessage);
    testMessage.content = "!cheers Vodka Soda";
    app.cheersHandler(testMessage);

    testMessage.author = secondUser;
    testMessage.content = "!cheers Whiskey Neat";
    app.cheersHandler(testMessage);

    app.whoIsDrunkHandler(testMessage);
    expect(textChannel.send).toHaveBeenLastCalledWith(
      `Corrupting has had a Lite Beer, and a Vodka Soda.\nZeekin has had a Whiskey Neat.`
    );
  });
});
