import Discord, { User } from "discord.js";
import Person from "./models/Person";
import * as _ from "lodash";
require("dotenv").config();

export class App {
  client: Discord.Client;
  public totalDrinks: number;
  public people: Person[];

  constructor(client: Discord.Client) {
    this.client = client;
    this.totalDrinks = 0;
    this.people = [];
  }

  public readyHandler() {
    console.log("I am alive and well!");
  }

  public cheersHandler(message: Discord.Message) {
    let drinkName = message.content.replace("!cheers", "").trimLeft();
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

  public resetBotHandler() {
    this.cleanup();
  }

  private addDrinkToUser(user: User, drinkName: string) {
    let userExists = this.people.some(person => {
      return person.user.username == user.username;
    });

    if (!userExists) {
      let person: Person = {
        user: user,
        drinks: [drinkName]
      };
      this.people.push(person);
    } else {
      this.people.forEach(person => {
        if (person.user.username === user.username) {
          person.drinks.push(drinkName);
        }
      });
    }
  }

  private getDrinks(): string {
    let totalDrinks = this.people.map(person => {
      if (person.drinks.length === 1) {
        return `${
          person.user.username
        } has had a ${person.drinks[0].toString()}.`.replace(",", "");
      } else {
        return `${person.user.username} has had a ${person.drinks.join(
          ", and a "
        )}.\n`;
      }
    });
    return totalDrinks.toString().replace("\n,", "\n");
  }
  private cleanup(): void {
    this.totalDrinks = 0;
    this.people = [];
  }
}
