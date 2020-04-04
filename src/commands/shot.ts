/* eslint-disable @typescript-eslint/no-misused-promises */
import { Command, CommandoClient, CommandMessage } from 'discord.js-commando';
import { Message, RichEmbed, User } from 'discord.js';
export class Shot extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'shot',
      group: 'basic-commands',
      memberName: 'shot',
      description: 'Call for a server-wide shot! Members can opt in to participate',
      examples: ['!shot'],
    });
  }

  //   TODO: the ts-ignore below sucks, but it might be necessary
  //   @ts-ignore
  async run(message: CommandMessage) {
    const embed = new RichEmbed().setTitle(`Let's take a shot!`)
      .setDescription(`${message.author} has request a group shot! React with an emoji to join!
      🥂: Participate in the shot
      🚫: Nevermind, I don't want to take the shot
      ✅: We're ready to take a drink`);

    const sentMessage = (await message.say(embed)) as Message;
    await sentMessage.react(`🥂`);
    await sentMessage.react(`🚫`);
    await sentMessage.react(`✅`);

    const collector = sentMessage.createReactionCollector((reaction, user) => {
      return [`🥂`, `🚫`, `✅`].includes(reaction.emoji.name) && user.id === message.author.id;
    });

    collector.on('collect', (collected) => {
      if (collected.emoji.name === `✅`) {
        // TODO: Iterate over these reactions and filter out Drunkcord reactions
        // Put all users who put a 🥂 into a collection of some sort
        //  Mention those users in the shot message
        console.log(collected.message.reactions);

        //   TODO: pass the users mentioned above to here
        this.countdownToShots(message, [undefined]);
        collector.stop();
      }
    });

    collector.on('end', (collection) => {
      console.log(`Ending the shot collector's lifecycle`);
    });
  }

  async countdownToShots(message: CommandMessage, shotTakers: (User | undefined)[]) {
    // TODO: This is among the least creative code I've ever written
    // Either resolve all of these in one big promise, or use some recursion or something functional
    // Perhaps RX would do this?
    const sentMessage = (await message.say('Shot time!')) as Message;
    setTimeout(async () => {
      await sentMessage.edit('Time to take a shot in 5');
    }, 1000);

    setTimeout(async () => {
      await sentMessage.edit('Time to take a shot in 4');
    }, 2000);

    setTimeout(async () => {
      await sentMessage.edit('Time to take a shot in 3');
    }, 3000);

    setTimeout(async () => {
      await sentMessage.edit('Time to take a shot in 2');
    }, 4000);

    setTimeout(async () => {
      await sentMessage.edit('Time to take a shot in 1');
    }, 5000);

    setTimeout(async () => {
      await message.say({
        embed: {
          color: 16777215,
          description: 'Shot time!',
          image: {
            //   TODO: Build a list of random gifs that are fun to take shots to
            url: 'https://media.giphy.com/media/xULW8JjyKvBKrIh2xy/giphy.gif',
          },
        },
      });
    }, 6000);
  }
}
