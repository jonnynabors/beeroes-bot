import { Client } from "pg";

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

export { initializeDatabase };
