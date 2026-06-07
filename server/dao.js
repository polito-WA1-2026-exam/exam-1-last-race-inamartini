import sqlite3 from "sqlite3";
import crypto from "crypto";

// open database file, create if it doesn't exist
const db = new sqlite3.Database("last-race.sqlite", (err) => {
    if (err) throw err;
});


/* USERS */

// check if a user login is correct
// fetches user by username, then uses crypto.script to hash the submitted password with the stored salt and compares
// to the stored hash using timingSafeEqual (prevents timing attacks). Returns user object if correct, false otherwise.
export const getUser = (username, password) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM user WHERE username = ?";
        db.get(sql, [username], (err, row) => {
            if (err) {
                reject(err);
            }
            else if (row === undefined) {
                resolve(false);
            }
            else {
                const user = {user_id: row.user_id, username: row.username, email: row.email};

                crypto.scrypt(password, row.salt, 16, function(err, password) {
                    if (err) reject(err);
                    if(!crypto.timingSafeEqual(Buffer.from(row.password, "hex"), password))
                        resolve(false);
                    else {
                        resolve(user);
                    }
                });
            }
        });
    });
};

/* NETWORK */

// create the metro network
// Runs three queries in one using Promise.all: station, segment and line+line_station. Then groups the line rows into
// a structured object where each line has a stations array. Returns {stations, segments, lines}.
export const getNetwork = () => {
    return new Promise((resolve, reject) => {

        const stations = new Promise((res, rej) => {
            db.all("SELECT * FROM station", [], (err, rows) => err ? rej(err) : res(rows))
        })

        const segments = new Promise((res, rej) => {
            db.all("SELECT * FROM segment", [], (err, rows) => err ? rej(err) : res(rows))
        })

        const lines = new Promise((res, rej) => {
            db.all(`
        SELECT l.line_id, l.line_name, l.color, ls.station_id, ls.station_order
        FROM line l
        JOIN lineStation ls ON l.line_id = ls.line_id
        ORDER BY l.line_id, ls.station_order
      `, [], (err, rows) => err ? rej(err) : res(rows))
        })

        Promise.all([stations, segments, lines])
            .then(([stationRows, segmentRows, lineRows]) => {
                // group lineStation rows into lines with a stations array
                const linesMap = {}
                for (const row of lineRows) {
                    if (!linesMap[row.line_id]) {
                        linesMap[row.line_id] = { line_id: row.line_id, line_name: row.line_name, color: row.color, stations: [] }
                    }
                    linesMap[row.line_id].stations.push({ station_id: row.station_id, station_order: row.station_order })
                }
                resolve({
                    stations: stationRows,
                    segments: segmentRows,
                    lines: Object.values(linesMap)
                })
            })
            .catch(reject)
    })
}

/* GAMES */

// create a new game
// inserts a new game row with the user_id and the assigned start/end stations. Returns the new game_id.
export const createGame = (user_id, start_station_id, destination_station_id) => {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO game (user_id, start_station_id, destination_station_id) VALUES (?, ?, ?)",
            [user_id, start_station_id, destination_station_id],
            function(err) { err ? reject(err) : resolve(this.lastID) }
        )
    })
}

// get an existing game
// fetches a single game by id
export const getGame = (game_id) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM game WHERE game_id = ?", [game_id], (err, row) => {
            err ? reject(err) : resolve(row)
        })
    })
}

// update game status
// update a game's status from 'planning' to 'finished' and the final score when the game ends.
export const updateGameStatus = (game_id, status, score) => {
    return new Promise((resolve, reject) => {
        db.run(
            "UPDATE game SET status = ?, score = ? WHERE game_id = ?",
            [status, score, game_id],
            (err) => err ? reject(err) : resolve()
        )
    })
}

// register actions between stations
// inserts one row per step in the game, recording the stations the user traveled between, which event occurd, and
// how many cons are left after that step.
export const saveGameAction = (game_id, step_number, from_station_id, to_station_id, event_id, remaining_coins) => {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO gameAction (game_id, step_number, from_station_id, to_station_id, event_id, remaining_coins) VALUES (?, ?, ?, ?, ?, ?)",
            [game_id, step_number, from_station_id, to_station_id, event_id, remaining_coins],
            function(err) { err ? reject(err) : resolve(this.lastID) }
        )
    })
}

/* EVENTS */

// fetches all events from the database. Used during execution to pick an event for each segment.
export const getEvents = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM event", [], (err, rows) => err ? reject(err) : resolve(rows))
    })
}

/* RANKING */

// get best game (with the highest number of coins) for each user
// joins game and user, groups by user, takes the max score per user and takes the best score (descending)
// Only counts games with status = 'finished'. Gives one row per user showing their personal best score.
export const getRanking = () => {
    return new Promise((resolve, reject) => {
        db.all(`
            SELECT u.username, MAX(g.score) as best_score
            FROM game g
                     JOIN user u ON g.user_id = u.user_id
            WHERE g.status = 'finished'
            GROUP BY g.user_id
            ORDER BY best_score DESC
        `, [], (err, rows) => err ? reject(err) : resolve(rows))
    })
}