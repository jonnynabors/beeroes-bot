import Discord, { User, MessageEmbed, RichEmbed } from "discord.js";
import Person from "./models/Person";
import * as _ from "lodash";
import Drink from "./models/Drink";
import { Client } from "pg";
import { initializeDatabase } from "./network";
require("dotenv").config();

export class App {
  client: Discord.Client;
  pgClient: Client;
  public totalDrinks: number;
  public people: Person[];

  constructor(client: Discord.Client, pgClient: Client) {
    this.client = client;
    this.pgClient = pgClient;
    this.totalDrinks = 0;
    this.people = [];
  }

  public readyHandler() {
    console.log("I am alive and well!");
    initializeDatabase(this.pgClient);
  }

  public cheersHandler(message: Discord.Message) {
    let drinkName = message.content.replace("dc!cheers", "").trimLeft();
    this.addDrinkToUser(message.author, drinkName);
    this.totalDrinks++;
    message.channel.send("Enjoy that brewchacho, brochacho. 🍺");
  }

  public drinkCountHandler(message: Discord.Message) {
    message.channel.send(
      `${this.totalDrinks} drink(s) have been consumed by the server! 🍻🥃`
    );
  }

  public whoIsDrunkHandler(message: Discord.Message) {
    if (this.people.length === 0) {
      message.channel.send(
        "Nobody is drunk because nobody has had anything to drink! 🏝️"
      );
    } else {
      message.channel.send(this.getDrinks());
    }
  }

  public resetBotHandler(message: Discord.Message) {
    message.channel.send(
      "All drinks have been cleared. Thanks for drinking with me! 🥃"
    );
    this.cleanup();
  }

  public helpHandler(message: Discord.Message) {
    // TODO: Make this a constant
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
    message.channel.send(embed);
  }

  private addDrinkToUser(user: User, drinkName: string) {
    let person: Person | undefined = _.find(
      this.people,
      (person: Person) => person.user.username === user.username
    );
    if (!person) {
      this.createNewPersonWithDrink(user, drinkName);
    } else {
      let existingDrink = _.find(
        person.drinks,
        (drink: Drink) => drink.name === drinkName
      );

      if (existingDrink) {
        existingDrink.quantity++;
      } else {
        person.drinks.push({
          name: drinkName,
          quantity: 1
        });
      }
      person.drinks = _.reverse(
        _.sortBy(person.drinks, (drink: Drink) => drink.quantity)
      );
    }
  }

  private createNewPersonWithDrink(user: Discord.User, drinkName: string) {
    let person: Person = {
      user: user,
      drinks: [
        {
          name: drinkName,
          quantity: 1
        }
      ]
    };
    this.people.push(person);
  }

  private getDrinks(): string {
    let totalDrinks = this.people.map(person => {
      if (person.drinks.length === 1) {
        return this.singleDrinkMessage(person);
      } else {
        return `${person.user.username} has had${this.multiDrinkMessage(
          person.drinks
        )}`;
      }
    });
    return _.join(totalDrinks, "");
  }

  private singleDrinkMessage(person: Person): string {
    return `${
      person.user.username
    } has had a ${person.drinks[0].name.toString()}.\n`;
  }

  private multiDrinkMessage(drinks: Drink[]): string {
    let msg = drinks.map(drink => {
      if (drink.quantity === 1) {
        return ` and a ${drink.name}`;
      } else {
        return ` ${drink.quantity} ${drink.name}s,`;
      }
    });
    return `${msg.join("").toString()}.\n`;
  }

  private cleanup(): void {
    this.totalDrinks = 0;
    this.people = [];
  }
}
