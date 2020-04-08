import { Command, CommandoClient } from 'discord.js-commando';
import { getDrinksForGuild } from '../network';
import { groupBy } from 'lodash';
import { messageFormatter } from '../utils/helpers';

export class Drunk extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'drunk',
      group: 'basic-commands',
      memberName: 'drunk',
      description: 'Find out who is the drunkest in your server!',
      examples: ['!drunk'],
    });
  }

  async run(message: any) {
    try {
      const people = await getDrinksForGuild(message);
      const drinksByUserName = groupBy(people, 'username');
      if (people?.length === 0) {
        message.channel.send('Nobody is drunk because nobody has had anything to drink! 🏝️');
      } else {
        return message.say(messageFormatter(drinksByUserName));
      }
    } catch (error) {
      console.error('Error fetching who is drunk', error);
      return message.say(`An error occurred while figuring out who is drunk :(.`);
    }
  }
}
