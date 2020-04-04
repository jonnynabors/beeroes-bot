import { Command, CommandoClient } from 'discord.js-commando';
import { clearDrinksForGuild } from '../network';
export class ClosingTime extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'closingtime',
      group: 'basic-commands',
      memberName: 'closingtime',
      description:
        'Clears all of the drinks in Drunkcord, allowing you to start the drinking fresh!',
      examples: ['!closingtime'],
    });
  }
  async run(message: any) {
    try {
      await clearDrinksForGuild(message);
      return message.say('All drinks have been cleared. Thanks for drinking with me! 🥃');
    } catch (error) {
      console.error('An error occurred when clearing the drinks for guild', error);
    }
  }
}
