import * as _ from "lodash";
import { RichEmbed } from "discord.js";
let embed: RichEmbed;
// total drinks consumed by server
let totalDrinks: number;
// TODO: Add a type
let drinks: any[];
// amount of drinks that the drunkest person has had
let highScore: number;
let currentDrinker: string;

function messageFormatter(drinkData: any): RichEmbed {
  embed = new RichEmbed();
  embed.setColor("RANDOM");
  embed.setThumbnail("https://i.imgur.com/gaf3cVL.png");

  currentDrinker = "";
  totalDrinks = 0;
  drinks = [];
  highScore = 0;
  let msg = "";
  for (let key in drinkData) {
    drinks.push(drinkData[key]);
    totalDrinks += drinkData[key].length;

    currentDrinker = key;
    msg = formatDrinksForUser(_.countBy(drinkData[key], "drinkname"));

    renderUsersDrinks(currentDrinker, msg);
    msg = "";
  }

  renderDescription(_.maxBy(drinks, drink => drink.length));
  embed.setFooter(`That's a total of ${totalDrinks} drinks!`);
  return embed;
}

function formatDrinksForUser(drinksByCount: _.Dictionary<Number>) {
  let privateMessage = "";
  for (let key in drinksByCount) {
    privateMessage += `* ${drinksByCount[key]} ${key}\n`;
  }
  return privateMessage;
}

function renderUsersDrinks(user: string, drinks: string) {
  // RichEmbed field values have a max character length of 1024
  if (drinks.length < 1024) {
    embed.addField(`${user} has had`, `${drinks}`);
  } else {
    embed.addField(
      `${user} has had`,
      `**more drinks than the server can count**`
    );
  }
}

function renderDescription(mostDrinksByUser: any) {
  if (mostDrinksByUser) {
    let mostDrunk = mostDrinksByUser[0].username;
    highScore = mostDrinksByUser.length;
    embed.setDescription(
      `Looks like **${mostDrunk}** has had the most to drink with ${highScore} total drinks!`
    );
  }
}
export { messageFormatter };
