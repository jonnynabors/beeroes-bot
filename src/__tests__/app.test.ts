import {
  User,
  Client,
  Message,
  TextChannel,
  Guild,
  RichEmbed
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
    // @ts-ignore
    app = new App(testClient, {});
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
    testMessage.content = "dc!cheers";
    app.cheersHandler(testMessage);

    expect(textChannel.send).toHaveBeenCalledWith(
      "Enjoy that brewchacho, brochacho. 🍺"
    );
  });

  it("should emit the amount of beers drank by the server", () => {
    testMessage.content = "dc!cheers a beer";
    app.cheersHandler(testMessage);
    testMessage.content = "dc!cheers a vodka";
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

  it("should correctly format multiple drinks starting with multiple", () => {
    let firstUser = new User(testClient, {
      username: "Corrupting"
    });
    let secondUser = new User(testClient, {
      username: "Zeekin"
    });
    testMessage.author = firstUser;
    testMessage.content = "dc!cheers Lite Beer";
    app.cheersHandler(testMessage);

    testMessage.author = firstUser;
    testMessage.content = "dc!cheers Lite Beer";
    app.cheersHandler(testMessage);

    app.whoIsDrunkHandler(testMessage);
    expect(textChannel.send).toHaveBeenLastCalledWith(
      `Corrupting has had 2 Lite Beers.\n`
    );

    testMessage.content = "dc!cheers Vodka Soda";
    app.cheersHandler(testMessage);

    testMessage.content = "dc!cheers Craft Beer";
    app.cheersHandler(testMessage);

    testMessage.content = "dc!cheers Craft Beer";
    app.cheersHandler(testMessage);

    testMessage.author = secondUser;
    testMessage.content = "dc!cheers Whiskey Neat";
    app.cheersHandler(testMessage);

    app.whoIsDrunkHandler(testMessage);
    expect(textChannel.send).toHaveBeenLastCalledWith(
      `Corrupting has had 2 Craft Beers, 2 Lite Beers, and a Vodka Soda.\nZeekin has had a Whiskey Neat.\n`
    );
  });

  it("should correctly format multiple drinks starting with single", () => {
    let firstUser = new User(testClient, {
      username: "Corrupting"
    });
    let secondUser = new User(testClient, {
      username: "Zeekin"
    });
    testMessage.author = firstUser;
    testMessage.content = "dc!cheers Lite Beer";
    app.cheersHandler(testMessage);

    testMessage.author = secondUser;
    testMessage.content = "dc!cheers Whiskey Neat";
    app.cheersHandler(testMessage);

    testMessage.content = "dc!cheers Coors Light";
    app.cheersHandler(testMessage);

    testMessage.content = "dc!cheers Whiskey Neat";
    app.cheersHandler(testMessage);

    app.whoIsDrunkHandler(testMessage);
    expect(textChannel.send).toHaveBeenLastCalledWith(
      `Corrupting has had a Lite Beer.\nZeekin has had 2 Whiskey Neats, and a Coors Light.\n`
    );
  });

  it("should emit a message notifying the drinks have been cleared", () => {
    testMessage.content = "dc!closingtime";
    app.resetBotHandler(testMessage);
    expect(textChannel.send).toHaveBeenCalledWith(
      "All drinks have been cleared. Thanks for drinking with me! 🥃"
    );
  });

  it("should emit help commands when asked politely", () => {
    testMessage.content = "dc!help";
    app.helpHandler(testMessage);
    let commands = `
      How to use Drunkcord! \n
      \`dc!cheers <drink_name>\` will add a drink\n
      \`dc!drinks\` will show how many total drinks have been drank\n
      \`dc!drunk\` will show who's drunk\n
      \`dc!closingtime\` will reset the drinks
    `;
    let embed = new RichEmbed()
      .setTitle("Drunkcord Help")
      .setColor(0xff0000)
      .setThumbnail("https://i.imgur.com/gaf3cVL.png")
      .setDescription(commands);
    expect(textChannel.send).toHaveBeenCalledWith(embed);
  });

  it.only("should correctly format drinks", () => {
    const testData = {
      Corrupting: [
        { username: "Corrupting", drinkname: "Bud Light" },
        { username: "Corrupting", drinkname: "Whiskey" },
        { username: "Corrupting", drinkname: "Bud Light" }
      ],
      Giantjimmy: [{ username: "Giantjimmy", drinkname: "Bud Light" }],
      Cathedrals: [
        { username: "Cathedrals", drinkname: "Miller Light" },
        { username: "Cathedrals", drinkname: "Bud Light" },
        { username: "Cathedrals", drinkname: "Miller Light" },
        { username: "Cathedrals", drinkname: "Bud Light" },
        { username: "Cathedrals", drinkname: "Bud Light" },
        { username: "Cathedrals", drinkname: "Blue Moon" }
      ]
    };

    expect(app.messageFormatter(testData)).toEqual(
      `Corrupting has had 2 Bud Lights, and a Whiskey.\nGiantjimmy has had a Bud Light.\nCathedrals has had 2 Miller Lights, and 3 Bud Lights, and a Blue Moon.\n`
    );
  });
});
