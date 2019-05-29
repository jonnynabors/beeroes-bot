import * as _ from "lodash";
import { RichEmbed } from "discord.js";
import Drink from "../models/Drink";
const embed = new RichEmbed();
// total drinks consumed by server
let totalDrinks = 0;
// amount of drinks that the drunkest person has had
let highScore = 0;

// TODO: Add a type
let drinks: any[] = [];

function messageFormatter(drinkData: any): RichEmbed {
  embed.title = "Who's Drunk?";
  let msg = "";
  for (let key in drinkData) {
    drinks.push(drinkData[key]);
    totalDrinks += drinkData[key].length;
    let currentDrinker = key;
    msg = formatDrinksForUser(_.countBy(drinkData[key], "drinkname"));
    embed.addField(`${currentDrinker} has had`, `${msg}`);
    msg = "";
  }

  let mostDrunk = _.maxBy(drinks, drink => drink.length)[0].username;
  embed.footer = {
    text: `\nThat's a total of ${totalDrinks} drinks!`
  };
  embed.description = `Looks like **${mostDrunk}** has had the most to drink!`;
  return embed;
}

function formatDrinksForUser(drinksByCount: _.Dictionary<Number>) {
  let privateMessage = "";
  for (let key in drinksByCount) {
    privateMessage += `* ${drinksByCount[key]} ${key}\n`;
  }
  return privateMessage;
}

export { messageFormatter };
