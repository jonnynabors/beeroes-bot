import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { addDrink } from '../network';
import { getRandomCheersMessage } from '../utils/helpers';
export class CheersMany extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'cheers-many',
      group: 'plural-commands',
      memberName: 'cheers-many',
      description: `Add several drinks at once, in a comma separated piece of text. Great if you've fallen behind and want to add multiple drinks at once!`,
      aliases: ['cheers-m', 'cheers-multiple'],
      examples: [
        '!cheers-many vodka soda, whiskey sour, tequila shot',
        '!cheers-many whiskey, vodka',
      ],
      args: [
        {
          key: 'drinkNames',
          type: 'string',
          prompt:
            'You must enter some drink names! See `!drunk-help cheers-many` for some examples.',
        },
      ],
    });
  }

  async run(message: CommandoMessage, { drinkNames }: any) {
    try {
      const drinks = (drinkNames as string)
        .replace(/'/g, '')
        .split(',')
        .map((drink) => drink.trimLeft());
      await Promise.all(
        drinks.map(async (drink) => {
          await addDrink(message.author.username, message.guild.id, drink);
        })
      );
      return await message.say(getRandomCheersMessage());
    } catch (error) {
      console.error('An error occurred trying to cheers multiple drinks!', error);
      throw new Error('An error occurred saving those drinks!');
    }
  }
}
