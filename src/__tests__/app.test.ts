import {
  User,
  Client,
  Message,
  TextChannel,
  Guild,
  RichEmbed
} from "discord.js";
import { App } from "../app";
import * as Network from "../network";

jest.spyOn(Network, "initializeDatabase").mockImplementation(() => jest.fn());
jest.spyOn(Network, "clearDrinksForGuild").mockResolvedValue({
  command: "",
  rowCount: 0,
  oid: 0,
  rows: [],
  fields: []
});
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

  it("should emit a cheers emoji when the cheers handler is called with a drink", () => {
    jest.spyOn(Network, "addDrink").mockImplementation(() => jest.fn());

    testMessage.content = "!cheers Vodka";
    app.cheersHandler(testMessage);

    expect(textChannel.send).toHaveBeenCalledWith(
      "Enjoy that brewchacho, brochacho. 🍺"
    );
  });

  it("should return an error message and not log a drink if an empty cheers is called for", () => {
    jest.spyOn(Network, "addDrink").mockImplementation(() => jest.fn());

    testMessage.content = "!cheers    ";
    app.cheersHandler(testMessage);

    expect(textChannel.send).toHaveBeenCalledWith(
      "You can't cheers with an empty glass! Add the name of what you're drinking after you !cheers"
    );
  });

  it("should return an error message and not log a beer if an empty beers is called for", () => {
    // jest.spyOn()
    testMessage.content = "!beers    ";
    app.beerHandler(testMessage);

    expect(textChannel.send).toHaveBeenCalledWith(
      "You can't raise a beer without providing a name! Make sure to include the name of the beer you're drinking after !beers"
    );
  });

  it("should emit the amount of beers drank by the server", async () => {
    jest.spyOn(Network, "addDrink").mockImplementation(() => jest.fn());
    testMessage.content = "!cheers a beer";
    app.cheersHandler(testMessage);
    testMessage.content = "!cheers a vodka";
    app.cheersHandler(testMessage);

    jest.spyOn(Network, "getDrinkCount").mockResolvedValue(2);
    await app.drinkCountHandler(testMessage);
    expect(textChannel.send).toHaveBeenLastCalledWith(
      "2 drink(s) have been consumed by the server! 🍻🥃"
    );
  });

  it("should emit a message saying the server is sober if nobody has had anything to drink", async () => {
    jest.spyOn(Network, "getDrinksForGuild").mockResolvedValue([]);
    await app.whoIsDrunkHandler(testMessage);
    expect(textChannel.send).toHaveBeenCalledWith(
      "Nobody is drunk because nobody has had anything to drink! 🏝️"
    );
  });

  it("should emit a message notifying the drinks have been cleared", async () => {
    testMessage.content = "dc!closingtime";
    await app.resetBotHandler(testMessage);
    expect(textChannel.send).toHaveBeenCalledWith(
      "All drinks have been cleared. Thanks for drinking with me! 🥃"
    );
  });

  it("should emit help commands when asked politely", () => {
    testMessage.content = "dc!help";
    app.helpHandler(testMessage);
    let commands = `
      How to use Drunkcord! \n
      \`!cheers <drink_name>\` will add a drink\n
      \`!drinks\` will show how many total drinks have been drank\n
      \`!drunk\` will show who's drunk\n
      \`!closingtime\` will reset the drinks
    `;
    let embed = new RichEmbed()
      .setTitle("Drunkcord Help")
      .setColor(0xff0000)
      .setThumbnail("https://i.imgur.com/gaf3cVL.png")
      .setDescription(commands);
    expect(textChannel.send).toHaveBeenCalledWith(embed);
  });

  it("should correctly format drinks", () => {
    const testData = {
      Corrupting: [
        { username: "Corrupting", drinkname: "Bud Light" },
        { username: "Corrupting", drinkname: "Whiskey" },
        { username: "Corrupting", drinkname: "Bud Light" }
      ],
      Deathspacito: [
        { username: "Corrupting", drinkname: "Bud Light" },
        { username: "Corrupting", drinkname: "Whiskey" }
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
      `Corrupting has had 2 Bud Lights, and a Whiskey.\nDeathspacito has had a Bud Light, and a Whiskey.\nGiantjimmy has had a Bud Light.\nCathedrals has had 2 Miller Lights, and 3 Bud Lights, and a Blue Moon.\n`
    );
  });
});
