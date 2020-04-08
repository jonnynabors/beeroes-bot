import { Command, CommandoClient } from 'discord.js-commando';
import { getDrinkCount } from '../network';

export class Drinks extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'drinks',
      group: 'basic-commands',
      memberName: 'drinks',
      description: 'Return the number of drinks that your server has currently consumed!',
      argsCount: 0,
      examples: ['!drinks'],
    });
  }

  async run(message: any) {
    const drinkCount = await getDrinkCount(message);
    return message.say(`${drinkCount.rowCount} drink(s) have been consumed by the server! 🍻🥃`);
  }
}
