import { Client, QueryResult } from "pg";
import { Message } from "discord.js";
import * as _ from "lodash";

const initializeDatabase = (client: Client) => {
  client.query(
    `CREATE TABLE IF NOT EXISTS drinks (
              "id" SERIAL primary key, 
              "username" varchar(450) NOT NULL,  
              "guild" varchar(450) NOT NULL,
              "drinkname" varchar (100) NOT NULL,
              "active" boolean
            )`,
    (err: Error, res: QueryResult) => {
      if (err) console.log(err, res);
    }
  );
};

const addDrink = (client: Client, message: Message, drinkName: string) => {
  client.query(
    `
            INSERT INTO drinks (username, guild, drinkname, active) 
            values ('${message.author.username}', '${
      message.guild.id
    }', '${drinkName}', true)
        `,
    (err: Error, res: QueryResult) => {
      console.log(err, res);
    }
  );
};

const getDrinkCount = async (client: Client, message: Message) => {
  const response = await client.query({
    rowMode: "array",
    text: `
        SELECT * FROM drinks where guild = '${
          message.guild.id
        }' and active = true
        `
  });
  return response.rowCount;
};

export interface Thing {
  username: string;
  drinkname: string;
}

const getDrinksForGuild = async (client: Client, message: Message) => {
  const response = await client.query({
    rowMode: "array",
    text: `
            SELECT * FROM drinks where guild = '${
              message.guild.id
            }' and active = true
            `
  });

  let things: Thing[] = [];

  response.rows.forEach((row: any[]) => {
    things.push({
      username: row[1],
      drinkname: row[3]
    });
  });
  return things;
};

const clearDrinksForGuild = async (client: Client, message: Message) => {
  const response = await client.query({
    rowMode: "array",
    text: `
    UPDATE drinks SET active = false WHERE guild = '${message.guild.id}'
    `
  });
  return response;
};

export {
  initializeDatabase,
  addDrink,
  getDrinkCount,
  getDrinksForGuild,
  clearDrinksForGuild
};
