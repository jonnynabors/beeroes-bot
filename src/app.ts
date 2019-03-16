require('dotenv').config();

import Discord from "discord.js"
const client = new Discord.Client();

let totalDrinks: number;

client.on('ready', () => {
    console.log('I am alive and well!');
    totalDrinks = 0;
})

client.on('message', (msg) => {
    if(msg.content === '!cheers') {
        totalDrinks++;
    }

    if(msg.content === '!beers') {
        msg.channel.send(`${totalDrinks} beer(s) have been drunk tonight!`)
    }
})

client.login(process.env.CLIENT_ID)