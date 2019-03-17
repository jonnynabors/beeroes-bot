import { User, Client } from "discord.js";
import { App } from "../app";
// TODO: work on tests
describe("Beeroes Bot", () => {
  it("should emit a successful message when the app starts", () => {
    let testClient = new Client();
    let app = new App(testClient);
    console.log = jest.fn();
    app.readyHandler();
    expect(console.log).toHaveBeenCalledWith("I am alive and well!");
  });
});
