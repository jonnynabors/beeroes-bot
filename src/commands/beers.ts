import { Command, CommandoClient } from 'discord.js-commando';
import { getBeerInformation, addDrink } from '../network';
import { RichEmbed } from 'discord.js';
export class Beers extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'beers',
      group: 'basic-commands',
      memberName: 'beers',
      description: `Add the beer you're enjoying to Drunkcord!`,
      examples: ['!beers'],
      args: [
        {
          key: 'beerName',
          prompt:
            "You can't raise a beer without providing a name! Make sure to include the name of the beer you're drinking after !beers",
          type: 'string',
        },
      ],
    });
  }

  async run(message: any, { beerName }: any) {
    try {
      const data = await getBeerInformation(beerName);
      await addDrink(message, data.beer_name);
      const fancyBeerMessage = new RichEmbed()
        .setAuthor(`It looks like you're drinking a ${data.beer_name}!`)
        .setTitle('Let me tell you about that beer!')
        .setFooter(
          `
          ABV: ${data.beer_abv}%
          Style: ${data.beer_style}
          `
        )
        .setColor(0xff0000)
        .setThumbnail(data.beer_label)
        .setDescription(data.beer_description);
      message.channel.send(fancyBeerMessage);
    } catch (error) {
      console.error('An error occurred while adding a drink', error);
      try {
        await addDrink(message, beerName);
        const embed = new RichEmbed()
          .setTitle('Oh no!')
          .setColor(0xff0000)
          .setThumbnail('https://i.imgur.com/gaf3cVL.png')
          .setDescription(
            `I can't find any information about that beer! I'm so sorry to have let you down :(.)`
          );
        return message.say(embed);
      } catch (error) {
        console.log('Error adding drink:', error);
        return message.say(`An error occurred while adding this drink :(.`);
      }
    }
  }
}
