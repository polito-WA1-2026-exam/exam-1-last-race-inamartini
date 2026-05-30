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