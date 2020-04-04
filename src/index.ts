import { CommandoClient } from 'discord.js-commando';
import { connectToPGPool } from './db/PostgresPool';
import { initializeDatabase } from './network';
const path = require('path');
require('dotenv').config();

const client = new CommandoClient({
  commandPrefix: '!',
  invite: 'https://discord.gg/5nJMzPA',
  unknownCommandResponse: false,
});

async function comeAlive() {
  try {
    await connectToPGPool();
    await initializeDatabase();
    console.log('successfully connected to postgres!');
  } catch (error) {
    console.error('An error occurred connecting to and setting up the Postgres database', error);
  }
}

try {
  client.login(process.env.CLIENT_ID);

  client.registry
    .registerDefaultTypes()
    .registerGroups([['basic-commands', 'Drunkcord Commands']])
    .registerDefaultGroups()
    .registerDefaultCommands({
      help: false,
    })
    .registerCommandsIn(path.join(__dirname, 'commands'));

  client.once('ready', () => {
    comeAlive();
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
    client.user.setActivity('with some new Drunkcord features');
  });
} catch (error) {
  console.error(error);
}
