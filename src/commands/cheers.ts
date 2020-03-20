import { Command, CommandoClient } from "discord.js-commando";
import { addDrink } from "../network";

export class Cheers extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "cheers",
      group: "basic-commands",
      memberName: "cheers",
      description:
        "Add a drink to Drunkcord! Raise a glass and toast your friends!",
      examples: [
        "!cheers Vodka and Soda",
        "!cheers Whiskey",
        "!cheers Red Bull and Vodka"
      ],
      args: [
        {
          key: "drinkName",
          prompt:
            "You must enter a drink name! See `!drunk-help cheers` for some examples.",
          type: "string"
        }
      ]
    });
  }

  async run(message: any, { drinkName }: any) {
    await addDrink(message, drinkName);
    return message.say(`"Enjoy that brewchacho, brochacho. 🍺"`);
  }
}
