import { Command, CommandoClient, CommandMessage } from 'discord.js-commando';
import { addDrink, getBeerInformation } from '../network';
export class BeersMany extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'beers-many',
      group: 'plural-commands',
      memberName: 'beers-many',
      description: `Add several beers at once, in a comma separated piece of text. Great if you've fallen behind and want to add multiple beers!`,
      aliases: ['beers-m', 'beers-multiple', 'beer-m', 'beer-multiple', 'beer-many'],
      examples: [
        '!beers-many Two Hearted Ale, Mr. IPA, Bud Light',
        '!beers-many Nitro Coffee Stout, Oberon',
      ],
      args: [
        {
          key: 'beerNames',
          type: 'string',
          prompt:
            'You must enter some drink names! See `!drunk-help beers-many` for some examples.',
        },
      ],
    });
  }

  async run(message: CommandMessage, { beerNames }: any) {
    try {
      const beers = (beerNames as string).split(',').map((beer) => beer.trimLeft());
      await Promise.all(
        beers.map(async (beer) => {
          const data = await getBeerInformation(beer);
          const richBeerName = data.beer_name.replace(/'/g, '');
          await addDrink(message.author.username, message.guild.id, richBeerName);
        })
      );
      return await message.say(`Cheers! I'll make sure those beers get logged.`);
    } catch (error) {
      console.error('An error occurred trying to add multiple beers!', error);
      throw new Error('Oh no! I encountered an error trying to log those drinks.');
    }
  }
}
