# Exam #1: "Last Race"
## Student: s362518 MARTINI INA

## React Client Application Routes

- Route `/`: Home page, if the user is logged in: a button to the game page, if the user is not logged in: a button to log in
- Route `/login`: Login page, users can log in to the application with their username and password
- Route `/ranking`: Ranking page, logged in users can see the ranking of the best games played by each player
- Route `/instructions`: Instructions page, all visitors can see the rules of the games
- Route `/game`: Game page, the page where the users play the game

## API Server

- POST `/api/sessions`
  - request body: `{ username, password }`
```text
{
  "username": "testuser",
  "password": "password123"
}
```
  - response body: `{ user_id, username, email }`
```text
{
  "user_id": 1,
          "username": "testuser",
          "email": "test@mail.com"
}
```
- GET `/api/sessions/current`
  - response body: `{ user_id, username, email }`
```text
{
  "user_id": 1,
          "username": "testuser",
          "email": "test@mail.com"
}
```
- DELETE `/api/sessions/current`
- POST `/api/users`
  - request body: `{ username, email, password }`
```text
{
  "username": "testuser",
          "email": "test@mail.com",
          "password": "password123"
}
```
  - response body: `{ user_id }`
```text
{
  "user_id": 2
}
```
- GET `/api/network`
  - response body: `{ stations: [...], segments [...], lines [...] }`
```text
{
  "stations": [...],
          "segments": [...],
          "lines": [...]
}
```
- GET `/api/ranking`
  - response body: `{ username, best_score }`
```text
[
  {
    "username": "testuser",
    "best_score": 20
  },
  {
    "username": "ina",
    "best_score": 18
  }
]
```
- POST `/api/games`
  - response body: `{ game_id, start_station: {station_id, station_name}, destination_station: {station_id, station_name}  }`
```text
{
  "game_id": 3,
          "start_station": {
    "station_id": 1,
            "station_name": "Central Station"
  },
  "destination_station": {
    "station_id": 8,
            "station_name": "Park"
  }
}
```
- POST `/api/games/:id/execute`
  - request parameters: :id = game_id
  - request body: `{ route: [station_id, ...] }`
```text
{
  "route": [1, 2, 5, 8]
}
```
  - response body (valid route): `{ valid: true, score: <number>, steps: [{step, from_station_id, to_station_id, event: { description, effect}, coins_after}] }`
```text
{
  "valid": true,
          "score": 14,
          "steps": [
    {
      "step": 1,
      "from_station_id": 1,
      "to_station_id": 2,
      "event": {
        "description": "Lost ticket",
        "effect": -2
      },
      "coins_after": 18
    }
  ]
}
```
  - response body (invalid route): `{ valid: false, score: 0, steps: [] }`
```text
{
  "valid": false,
          "score": 0,
          "steps": []
}
```


## Database Tables

- Table `user` - contains user_id, username, email, password, salt
- Table `game` - contains game_id, user_id, start_station_id, destination_station_id, initial_coins, score, status, created_at
- Table `station` - contains station_id, station_name
- Table `segment` - contains segment_id, station_1_id, station_2_id
- Table `line` - contains line_id, line_name, color
- Table `lineStation` - contains line_id, station_id, station_order
- Table `event` - contains event_id, event_description, effect
- Table `gameAction` - contains game_action_id, game_id, step_number, from_station_id, to_station_id, event_id, remaining_coins

![Database](/client/src/assets/database_lastrace.drawio.png)

## Main React Components

- `ExecutionPhase` (in `ExecutionPhase.jsx`): Replays the submitted route step by step, showing the event and coin effect for each segment, with a button to advance through steps.
- `Footer` (in `Footer.jsx`): Renders a simple footer with the author name and current year.
- `LoginForm` (in `LoginForm.jsx`): Renders a username/password form, handles login submission with loading/error state, and calls onLogin on success.
- `NavBar` (in `NavBar.jsx`): Renders the top navigation bar, showing different links based on login state, and handles logout.
- `PageContent` (in `PageContent.jsx`): A layout wrapper that renders a titled page with a content area, used by other components as a consistent page shell.
- `PlanningPhase` (in `PlanningPhase.jsx`): Lets the player build a route by clicking segments, shows a countdown timer, and allows undoing the last stop or submitting the route.
- `ResultPhase` (in `ResultPhase.jsx`): Shows the final game outcome.
- `SetUpPhase` (in `SetUpPhase.jsx`): Shows the metro map with lines for reference and a button to start the game.

## Screenshot

Login Page:

![LogIn page](/client/src/assets/login.png)

Home Page:

![Home page](/client/src/assets/home.png)
![Home page, logged in](/client/src/assets/home_login.png)

Instructions page:

![Instructions page](/client/src/assets/instructions.png)

Game page:

![Game page](/client/src/assets/game_1.png)
![Game page](/client/src/assets/game_2.png)
![Game page](/client/src/assets/game_3.png)
![Game page](/client/src/assets/game_4.png)
![Game page](/client/src/assets/game_5.png)
![Game page](/client/src/assets/game_6.png)
![Game page](/client/src/assets/game_7.png)

Rankings page:

![Rankings page](/client/src/assets/ranking.png)

## Users Credentials

- username: `ina`, password: `password`
- username: `testuser`, password: `password123`
- username: `inamartini`, password: `password`
- username: `hannah`, password: `password`

## Use of AI Tools
Briefly describe whether you used any AI tools (e.g., ChatGPT, GitHub Copilot, Claude) while working on this project, for which purposes (e.g., clarifying concepts, debugging, generating code), and how you verified or adapted their output.
If you did not use any AI tools, simply state so.
