import express from "express";
import morgan from "morgan";
import cors from "cors";
import { getUser, createUser, getNetwork, createGame, getGame, updateGameStatus, saveGameAction, getEvents, getRanking } from './dao.js'


import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

// init
const app = express();
const port = 3001;

// middlewares
app.use(express.json());
app.use(morgan("dev"));

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessState: 200,
  credentials: true
};
app.use(cors(corsOptions))

// When a user logs in, the getUser function is called, if correct, the user is stored in the session
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await getUser(username, password);

  if(!user)
      //null -> no error, invalid credetials, message
    return cb(null, false, "Incorrect username or password."); // error message in the WWW-Authenticated header of the response

  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  console.log(req.user)
  return res.status(401).json({error: "Not authorized"});
}

app.use(session({
  secret: "bigSecret13578642!!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate("session"));


function validateRoute(route, game, network) {
  if (!route || route.length < 2) return false

  // must start and end at assigned stations
  if (route[0] !== game.start_station_id) return false
  if (route[route.length - 1] !== game.destination_station_id) return false

  const { segments, lines } = network

  // build a set of valid segments
  const segmentSet = new Set()
  for (const seg of segments) {
    segmentSet.add(`${seg.station_1_id}-${seg.station_2_id}`)
    segmentSet.add(`${seg.station_2_id}-${seg.station_1_id}`)
  }

  // find which lines serve each station
  const stationLines = {}
  for (const line of lines) {
    for (const ls of line.stations) {
      if (!stationLines[ls.station_id]) stationLines[ls.station_id] = new Set()
      stationLines[ls.station_id].add(line.line_id)
    }
  }

  // walk the route: each step must be a valid segment,
  // and line changes only at stations served by multiple lines
  let currentLines = stationLines[route[0]] ?? new Set()

  for (let i = 0; i < route.length - 1; i++) {
    const from = route[i]
    const to = route[i + 1]

    // segment must exist
    if (!segmentSet.has(`${from}-${to}`)) return false

    const toLines = stationLines[to] ?? new Set()

    // find lines that connect from -> to (shared between both stations)
    const sharedLines = [...currentLines].filter(l => toLines.has(l))
    if (sharedLines.length === 0) {
      // no shared line: only valid if 'from' is an interchange (served by 2+ lines)
      // meaning the player changed lines here
      const fromIsInterchange = (stationLines[from]?.size ?? 0) > 1
      if (!fromIsInterchange) return false
      // after a line change, any line at 'to' is valid
      currentLines = toLines
    } else {
      currentLines = new Set(sharedLines)
    }
  }

  return true
}

/* ROUTES */

// POST /api/sessions
// Interface sends username and password
app.post("/api/sessions", passport.authenticate("local"), function(req, res) {
  return res.status(201).json(req.user);
});

// GET /api/sessions/current
// Check if user is still logged in
app.get("/api/sessions/current", (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: "Not authenticated"});
});

// DELETE /api/session/current
// Log out
app.delete("/api/sessions/current", (req, res) => {
  req.logout(() => {
    res.end();
  });
});


app.post('/api/users', async (req, res) => {
  const { username, email, password } = req.body
  if (!username || !email || !password)
    return res.status(400).json({ error: 'Missing fields' })
  try {
    const id = await createUser(username, email, password)
    res.status(201).json({ user_id: id })
  } catch (err) {
    if (err.message.includes('UNIQUE'))
      return res.status(409).json({ error: 'Username or email already taken' })
    res.status(500).json({ error: 'Server error' })
  }
})
// GET /api/network — public, used in Setup phase
app.get('/api/network', async (req, res) => {
  try {
    const network = await getNetwork()
    res.json(network)
  } catch (err) {
    res.status(500).json({ error: 'Failed to load network' })
  }
})

// everything below require the user to be logged in
app.use(isLoggedIn)

// GET /api/ranking — logged in users only, shows the ranking of the best games played among all players
app.get('/api/ranking', async (req, res) => {
  try {
    const ranking = await getRanking(req.user.user_id)
    res.json(ranking)
  } catch (err) {
    res.status(500).json({ error: 'Failed to load ranking' })
  }
})

// POST /api/games — start a new game, server picks start/destination
app.post('/api/games', async (req, res) => {
  try {
    const network = await getNetwork()
    const { stations, segments } = network

    // build adjacency list for BFS
    const adj = {}
    for (const s of stations) adj[s.station_id] = []
    for (const seg of segments) {
      adj[seg.station_1_id].push(seg.station_2_id)
      adj[seg.station_2_id].push(seg.station_1_id)
    }

    // BFS: returns shortest distance from start to all reachable stations
    const bfsDistances = (startId) => {
      const dist = { [startId]: 0 }
      const queue = [startId]
      while (queue.length) {
        const curr = queue.shift()
        for (const nb of adj[curr]) {
          if (dist[nb] === undefined) {
            dist[nb] = dist[curr] + 1
            queue.push(nb)
          }
        }
      }
      return dist
    }

    // pick a random start, then a random destination at least 3 stops away
    let start, destination, attempts = 0
    do {
      start = stations[Math.floor(Math.random() * stations.length)]
      const distances = bfsDistances(start.station_id)
      const reachable = stations.filter(s =>
          s.station_id !== start.station_id && (distances[s.station_id] ?? 0) >= 3
      )
      if (reachable.length === 0) { attempts++; continue }
      destination = reachable[Math.floor(Math.random() * reachable.length)]
    } while (!destination && attempts < 20)

    if (!destination) return res.status(500).json({ error: 'Could not find valid start/destination pair' })

    const game_id = await createGame(req.user.user_id, start.station_id, destination.station_id)
    res.status(201).json({
      game_id,
      start_station: start,
      destination_station: destination
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to create game' })
  }
})

// POST /api/games/:id/execute — validate route and apply events
// Body: { route: [station_id, station_id, ...] }
app.post('/api/games/:id/execute', async (req, res) => {
  console.log('Execute body:', req.body)        // debug
  console.log('Game id:', req.params.id)
  try {
    const game = await getGame(req.params.id)
    if (!game) return res.status(404).json({ error: 'Game not found' })
    if (game.user_id !== req.user.user_id) return res.status(403).json({ error: 'Forbidden' })
    if (game.status !== 'planning') return res.status(400).json({ error: 'Game already finished' })

    const { route } = req.body  // array of station_ids in order
    const network = await getNetwork()
    const events = await getEvents()

    // --- VALIDATION ---
    const isValid = validateRoute(route, game, network)

    if (!isValid) {
      await updateGameStatus(game.game_id, 'finished', 0)
      return res.json({ valid: false, score: 0, steps: [] })
    }

    // --- EXECUTION: apply a random event per segment ---
    let coins = 20
    const steps = []

    for (let i = 0; i < route.length - 1; i++) {
      const event = events[Math.floor(Math.random() * events.length)]
      coins += event.effect
      const remaining = Math.max(0, coins)  // floor at 0 only for storage

      await saveGameAction(game.game_id, i + 1, route[i], route[i + 1], event.event_id, remaining)

      steps.push({
        step: i + 1,
        from_station_id: route[i],
        to_station_id: route[i + 1],
        event: { description: event.event_description, effect: event.effect },
        coins_after: coins   // send real value so frontend can show negative before flooring
      })
    }

    const finalScore = Math.max(0, coins)
    await updateGameStatus(game.game_id, 'finished', finalScore)

    res.json({ valid: true, score: finalScore, steps })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to execute game' })
  }
})

// start the server
app.listen(port, () => {console.log(`API server started at http://localhost:${port}`)});