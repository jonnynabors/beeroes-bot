import client from '../app';
import { User, Client} from 'discord.js';
// TODO: work on tests
describe('Beeroes Bot', () => {

    afterEach(() => {
        cleanup();
    })

    it('should add a new person when they cheers a drink', () => {
        addPersonWithDrink('jonny', 'bud light');
        expect(client.people[0].user.username).toEqual('jonny');
        expect(client.people[0].drinks[0]).toEqual('bud light');
    });
    
    it('should return who is drinking what', () => {
        addPersonWithDrink('jonny', 'bud light');
        let output = client.getDrinks();
        expect(output).toContain('jonny has drank a bud light,')
    })    

    it.skip('should only add unique people that are drinking', () => {
        addPersonWithDrink('jonny', 'bud light');
        addPersonWithDrink('jonny', 'michelob ultra');
        expect(client.people.length).toBe(1);
        expect(client.people[0].drinks[0]).toBe('bud light');
        expect(client.people[0].drinks[1]).toBe('michelob ultra');
    });
});

function addPersonWithDrink(username: string, drinkName: string) {
    let testUser = new User(new Client(), {
        username
    });
    client.addDrinkToUser(testUser, drinkName);
}

function cleanup() {
    client.cleanup()
}
