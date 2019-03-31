import { Client } from "pg";
import { Message } from "discord.js";

const initializeDatabase = (client: Client) => {
  client.query(
    `CREATE TABLE IF NOT EXISTS drinks (
              "id" SERIAL primary key, 
              "username" varchar(450) NOT NULL,  
              "guild" varchar(450) NOT NULL,
              "drinkname" varchar (100) NOT NULL,
              "active" boolean
            )`,
    (err, res) => {
      if (err) console.log(err);
    }
  );
};

const addDrink = (client: Client, message: Message, drinkName: string) => {
  client.query(
    `
            INSERT INTO drinks (username, guild, drinkname, active) 
            values ('${message.author.id}', '${
      message.guild.id
    }', '${drinkName}', true)
        `,
    (err, res) => {
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

export { initializeDatabase, addDrink, getDrinkCount };
