import sqlite3 from "sqlite3";
import crypto from "crypto";

// open database file, create if it doesn't exist
const db = new sqlite3.Database("last-race.sqlite", (err) => {
    if (err) throw err;
});


// USERS
/** Finds a user in the database, verifies password and return if correct
 *
 * @param username username of the user
 * @param password password of the user
 * @returns {Promise<unknown>} user if password is correct
 */
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

export const createUser = (username, email, password) => {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(16).toString("hex");

        crypto.scrypt(password, salt, 16, (err, hashedPassword) => {
            if (err) return reject(err);

            const sql = `
                INSERT INTO user (username, email, password, salt)
                VALUES (?, ?, ?, ?)
            `;

            db.run(sql, [username, email, hashedPassword.toString("hex"), salt], function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });
    });
};

// NETWORK
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
        JOIN line_station ls ON l.line_id = ls.line_id
        ORDER BY l.line_id, ls.station_order
      `, [], (err, rows) => err ? rej(err) : res(rows))
        })

        Promise.all([stations, segments, lines])
            .then(([stationRows, segmentRows, lineRows]) => {
                // group line_station rows into lines with a stations array
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

// GAMES
export const createGame = (user_id, start_station_id, destination_station_id) => {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO game (user_id, start_station_id, destination_station_id) VALUES (?, ?, ?)",
            [user_id, start_station_id, destination_station_id],
            function(err) { err ? reject(err) : resolve(this.lastID) }
        )
    })
}

export const getGame = (game_id) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM game WHERE game_id = ?", [game_id], (err, row) => {
            err ? reject(err) : resolve(row)
        })
    })
}

export const updateGameStatus = (game_id, status, score) => {
    return new Promise((resolve, reject) => {
        db.run(
            "UPDATE game SET status = ?, score = ? WHERE game_id = ?",
            [status, score, game_id],
            (err) => err ? reject(err) : resolve()
        )
    })
}

export const saveGameAction = (game_id, step_number, from_station_id, to_station_id, event_id, remaining_coins) => {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO gameAction (game_id, step_number, from_station_id, to_station_id, event_id, remaining_coins) VALUES (?, ?, ?, ?, ?, ?)",
            [game_id, step_number, from_station_id, to_station_id, event_id, remaining_coins],
            function(err) { err ? reject(err) : resolve(this.lastID) }
        )
    })
}

export const getEvents = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM event", [], (err, rows) => err ? reject(err) : resolve(rows))
    })
}

export const getRanking = (user_id) => {
    return new Promise((resolve, reject) => {
        db.all(`
            SELECT g.game_id, g.score, g.created_at
            FROM game g
            WHERE g.user_id = ? AND g.status = 'finished'
            ORDER BY g.score DESC
        `, [user_id], (err, rows) => err ? reject(err) : resolve(rows))
    })
}