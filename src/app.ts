import Discord, { RichEmbed } from "discord.js";
import * as _ from "lodash";
import { Client } from "pg";
import {
  initializeDatabase,
  addDrink,
  getDrinkCount,
  getDrinksForGuild,
  clearDrinksForGuild,
  getBeerInformation
} from "./network";
require("dotenv").config();

export class App {
  client: Discord.Client;
  pgClient: Client;

  constructor(client: Discord.Client, pgClient: Client) {
    this.client = client;
    this.pgClient = pgClient;
  }

  public readyHandler() {
    console.log("I am alive and well!");
    initializeDatabase(this.pgClient);
  }

  public cheersHandler(message: Discord.Message) {
    let drinkName = message.content.replace("!cheers", "").trimLeft();
    addDrink(this.pgClient, message, drinkName);

    message.channel.send("Enjoy that brewchacho, brochacho. 🍺");
  }

  public async drinkCountHandler(message: Discord.Message) {
    const drinkCount = await getDrinkCount(this.pgClient, message);
    message.channel.send(
      `${drinkCount} drink(s) have been consumed by the server! 🍻🥃`
    );
  }

  public async whoIsDrunkHandler(message: Discord.Message) {
    const people = await getDrinksForGuild(this.pgClient, message);
    const drinksByUserName = _.groupBy(people, "username");
    if (people.length === 0) {
      message.channel.send(
        "Nobody is drunk because nobody has had anything to drink! 🏝️"
      );
    } else {
      message.channel.send(this.messageFormatter(drinksByUserName));
    }
  }

  public async resetBotHandler(message: Discord.Message) {
    await clearDrinksForGuild(this.pgClient, message);
    message.channel.send(
      "All drinks have been cleared. Thanks for drinking with me! 🥃"
    );
  }

  public helpHandler(message: Discord.Message) {
    // TODO: Make this a constant
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
    message.channel.send(embed);
  }

  public async beerHandler(message: Discord.Message) {
    let drinkName = message.content.replace("!beers", "").trimLeft();
    await addDrink(this.pgClient, message, drinkName);
    try {
      const data = await getBeerInformation(drinkName);
      const fancyBeerMessage = new RichEmbed()
        .setAuthor(`It looks like you're drinking a ${data.beer_name}!`)
        .setTitle("Let me tell you about that beer!")
        .setFooter(
          `
          ABV: ${data.beer_abv}%
          Style: ${data.beer_style}
          `
        )
        .setColor(0xff0000)
        .setThumbnail(data.beer_label)
        .setDescription(data.beer_description);
      message.channel.send(fancyBeerMessage);
    } catch (error) {
      console.log(error);
      let embed = new RichEmbed()
        .setTitle("Oh no!")
        .setColor(0xff0000)
        .setThumbnail("https://i.imgur.com/gaf3cVL.png")
        .setDescription(
          `I can't find any information about that beer! I'm so sorry to have let you down :(.)`
        );
      message.channel.send(embed);
    }
  }

  // TODO: Move this into a class, improve the text formatting
  public messageFormatter(drinkData: any) {
    let msg = "";
    for (var key in drinkData) {
      var drinkCounts = _.countBy(drinkData[key], "drinkname");
      msg += `${key} has had `;
      let idx = 1;
      for (var key in drinkCounts) {
        if (drinkCounts.length === 1) {
          msg += `a ${key}`;
        } else {
          if (drinkCounts[key] === 1) {
            msg += `a ${key}`;
          } else {
            msg += `${drinkCounts[key]} ${key}s`;
          }
          if (idx < _.size(drinkCounts)) {
            msg += `, and `;
          }
        }
        idx++;
      }
      msg += `.\n`;
    }
    return msg;
  }
}
