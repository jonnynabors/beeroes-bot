# TODOS

## Features

<!-- - Drunk handler -->
<!-- - Beers handler -->
<!-- - Closing time handler -->
<!-- - Add several new cheers sayings, e.g. "Cheers all you cool cats and kittens" -->

- "Send a shot" where I can tag who I want to have a drink/shot with. Do a synchronized drink timer
- BAC Calculator, but make sure people know we're not storing any user data
- Clinking glass audio
- "Silent mode", where I can do like `!beers two hearted ale --silent` or `!beers-silent two hearted ale` and just get a reaction as confirmation
- "Multiple drink mode", where I can do like `!beers-multiple two hearted ale, coors light` or `!cheers-many vodka soda, whiskey rocks`
  <!-- - Emoji voting or emoji interacting -->
    <!-- - Trigger an event with some Emoji voting (participate or don't) -->
    <!-- - Have a way to start the shot countdown or whatever -->
    <!-- - Figure out if we want to have a countdown -->
    <!-- - Add those drinks to the server -->

## Design decisions

- Should we still send an acknowledgement after a drink is successful? Should that be a DM?

## Development Tasks

<!-- - Add Prettier -->

- Investigate a better build tool?
- Set up some alerting/logging solution for the `client.error` related stuff
- Better documentation so I don't forget how the whole thing works after not touching this code for weeks
- Think some more about moving this to an AWS EC2 instance and migrating the data off of Heroku
