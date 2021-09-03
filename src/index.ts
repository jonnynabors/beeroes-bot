require('dotenv').config();
/* eslint-disable @typescript-eslint/no-misused-promises */
import { CommandoClient } from 'discord.js-commando';
import { connectToPGPool } from './db/PostgresPool';
import { initializeDatabase } from './network';
const DBL = require('dblapi.js');
const path = require('path');

const client = new CommandoClient({
  commandPrefix: '!',
});

function postDiscordGGMetrics() {
  // this should only happen for production
  if (process.env.DBL_API) {
    console.log('Discord.gg API Key found, logging install count every 30 minutes');
    const dblApi = new DBL(process.env.DBL_API, client);
    const dblStatsInterval = setInterval(async () => {
      try {
        await dblApi.postStats(client.guilds.cache.size);
        console.log('Successfully updated DBL with a guild count of ', client.guilds.cache.size);
      } catch (error) {
        console.log('Error posting stats to DBL', error);
        clearInterval(dblStatsInterval);
      }
    }, 1800000);

    dblApi.on('error', (error: any) => {
      console.error('Discord.gg API is having an issue...', error);
    });
  } else {
    console.log('No value for Discord.gg API, code must not be in production');
  }
}

async function comeAlive() {
  try {
    await connectToPGPool();
    await initializeDatabase();
    postDiscordGGMetrics();
    console.log('successfully connected to postgres!');
  } catch (error) {
    console.error('An error occurred connecting to and setting up the Postgres database', error);
  }
}

try {
  client
    .login(process.env.CLIENT_ID)
    .catch((error) => console.error('An error occurred while logging in', error));

  client.registry
    .registerDefaultTypes()
    .registerGroups([
      ['basic-commands', 'Drunkcord Commands'],
      ['plural-commands', 'Pluralized Drunkcord Commands'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands({
      help: false,
      unknownCommand: false,
    })
    .registerCommandsIn(path.join(__dirname, 'commands'))
    .registerCommandsIn(path.join(__dirname, 'plural-commands'));

  client.once('ready', () => {
    comeAlive();
    console.log(`Logged in as ${client.user!.tag}!`);
    client.user!.setActivity('with some new Drunkcord features');
  });

  client.on('error', (error) => {
    // TODO: Add an analytic for this, some notifications probably
    console.error('A fatal error occurred', error);
  });
} catch (error) {
  console.error(error);
}
