import Discord, { User } from "discord.js";
import Person from "./models/Person";
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
    message.channel.send("Enjoy that brewchacho, brochacho. 🍺");
  }

  // this.client.on("ready", () => {
  //   console.log("I am alive and well!");
  // });
}

// client.on("message", msg => {
//   if (msg.content.includes("!cheers")) {
//     let drinkName = msg.content.replace("!cheers", "").trimLeft();
//     addDrinkToUser(msg.author, drinkName);
//     totalDrinks++;
//   }

//   if (msg.content === "!beers") {
//     msg.channel.send(`${totalDrinks} beer(s) have been drunk tonight! 🍺`);
//   }

//   if (msg.content === "!whosdrunk") {
//     msg.channel.send(getDrinks());
//   }

//   if (msg.content === "!beeroes-clear") {
//     cleanup();
//   }
// });

// const addDrinkToUser = (user: User, drinkName: string) => {
//   let userExists = people.some(person => {
//     return person.user.username == user.username;
//   });

//   if (!userExists) {
//     let person: Person = {
//       user: user,
//       drinks: [drinkName]
//     };
//     people.push(person);
//   } else {
//     people.forEach(person => {
//       if (person.user.username === user.username) {
//         person.drinks.push(drinkName);
//       }
//     });
//   }
// };

// const getDrinks = () => {
//   let drinks = people.map(person => {
//     let drinks = person.drinks.map(drink => {
//       return ` a ${drink}`;
//     });
//     return `${person.user.username} has drank ${drinks} \n`;
//   });
//   return drinks.toString();
// };

// const cleanup = () => {
//   totalDrinks = 0;
//   people = [];
// };

// client.login(process.env.CLIENT_ID);

// export default { totalDrinks, people, addDrinkToUser, cleanup, getDrinks };
