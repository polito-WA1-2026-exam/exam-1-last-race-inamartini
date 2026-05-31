import express from "express";
import morgan from "morgan";
import cors from "cors";
import { getUser, createUser } from './dao.js'

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


app.use(isLoggedIn)




// start the server
app.listen(port, () => {console.log(`API server started at http://localhost:${port}`)});