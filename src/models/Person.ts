import { User } from "discord.js";
import Drink from "./Drink";

export default interface Person {
  user: User;
  drinks: Drink[];
}
