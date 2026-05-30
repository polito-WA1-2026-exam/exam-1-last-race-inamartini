PRAGMA foreign_keys = ON;

-- DROP TABLES
DROP TABLE IF EXISTS gameAction;
DROP TABLE IF EXISTS game;
DROP TABLE IF EXISTS event;
DROP TABLE IF EXISTS segment;
DROP TABLE IF EXISTS line_station;
DROP TABLE IF EXISTS line;
DROP TABLE IF EXISTS station;
DROP TABLE IF EXISTS user;

-- CREATE TABLES
CREATE TABLE IF NOT EXISTS user (
                                    user_id  INTEGER PRIMARY KEY AUTOINCREMENT,
                                    username TEXT    NOT NULL UNIQUE,
                                    email    TEXT    NOT NULL UNIQUE,
                                    password TEXT    NOT NULL,
                                    salt     TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS station (
                                       station_id   INTEGER PRIMARY KEY AUTOINCREMENT,
                                       station_name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS line (
                                    line_id   INTEGER PRIMARY KEY AUTOINCREMENT,
                                    line_name TEXT NOT NULL UNIQUE,
                                    color     TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS line_station (
                                            line_id       INTEGER NOT NULL,
                                            station_id    INTEGER NOT NULL,
                                            station_order INTEGER NOT NULL,

                                            PRIMARY KEY (line_id, station_id),
    FOREIGN KEY (line_id)    REFERENCES line(line_id),
    FOREIGN KEY (station_id) REFERENCES station(station_id)
    );

CREATE TABLE IF NOT EXISTS segment (
                                       segment_id   INTEGER PRIMARY KEY AUTOINCREMENT,
                                       station_1_id INTEGER NOT NULL,
                                       station_2_id INTEGER NOT NULL,

                                       FOREIGN KEY (station_1_id) REFERENCES station(station_id),
    FOREIGN KEY (station_2_id) REFERENCES station(station_id)
    );

CREATE TABLE IF NOT EXISTS event (
                                     event_id          INTEGER PRIMARY KEY AUTOINCREMENT,
                                     event_description TEXT    NOT NULL,
                                     effect            INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS game (
                                    game_id                INTEGER PRIMARY KEY AUTOINCREMENT,
                                    user_id                INTEGER NOT NULL,
                                    start_station_id       INTEGER NOT NULL,
                                    destination_station_id INTEGER NOT NULL,
                                    status                 TEXT    NOT NULL DEFAULT 'active',
                                    created_at             TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    score                  INTEGER NOT NULL DEFAULT 20,

                                    FOREIGN KEY (user_id)                REFERENCES user(user_id),
    FOREIGN KEY (start_station_id)       REFERENCES station(station_id),
    FOREIGN KEY (destination_station_id) REFERENCES station(station_id)
    );

CREATE TABLE IF NOT EXISTS gameAction (
                                          game_action_id  INTEGER PRIMARY KEY AUTOINCREMENT,
                                          game_id         INTEGER NOT NULL,
                                          step_number     INTEGER NOT NULL,
                                          from_station_id INTEGER NOT NULL,
                                          to_station_id   INTEGER NOT NULL,
                                          event_id        INTEGER,
                                          remaining_coins INTEGER NOT NULL,

                                          FOREIGN KEY (game_id)         REFERENCES game(game_id),
    FOREIGN KEY (from_station_id) REFERENCES station(station_id),
    FOREIGN KEY (to_station_id)   REFERENCES station(station_id),
    FOREIGN KEY (event_id)        REFERENCES event(event_id)
    );


-- STATIONS (IDs 1-12)
INSERT INTO station (station_name) VALUES
                                       ('Castle'),           -- 1
                                       ('Fountain'),         -- 2
                                       ('Museum'),           -- 3
                                       ('Shopping Centre'),  -- 4
                                       ('Industry'),         -- 5
                                       ('Tivoli'),           -- 6
                                       ('Port'),             -- 7
                                       ('Stadium'),          -- 8
                                       ('University'),       -- 9
                                       ('Park'),             -- 10
                                       ('Central Station'),  -- 11
                                       ('Theatre');          -- 12

-- LINES
INSERT INTO line (line_name, color) VALUES
                                        ('Blue Line',   'blue'),    -- 1
                                        ('Red Line',    'red'),     -- 2
                                        ('Green Line',  'green'),   -- 3
                                        ('Orange Line', 'orange');  -- 4

-- LINE STATIONS
-- Blue:   Theatre(12) -> Park(10) -> Central Station(11) -> Shopping Centre(4) -> Industry(5) -> Tivoli(6)
INSERT INTO line_station (line_id, station_id, station_order) VALUES
                                                                  (1, 12, 1), (1, 10, 2), (1, 11, 3), (1, 4, 4), (1, 5, 5), (1, 6, 6);

-- Red:    Park(10) -> Central Station(11) -> Stadium(8) -> Port(7)
INSERT INTO line_station (line_id, station_id, station_order) VALUES
                                                                  (2, 10, 1), (2, 11, 2), (2, 8, 3), (2, 7, 4);

-- Green:  University(9) -> Park(10) -> Museum(3) -> Shopping Centre(4)
INSERT INTO line_station (line_id, station_id, station_order) VALUES
                                                                  (3, 9, 1), (3, 10, 2), (3, 3, 3), (3, 4, 4);

-- Orange: Castle(1) -> Fountain(2) -> Museum(3) -> Shopping Centre(4)
INSERT INTO line_station (line_id, station_id, station_order) VALUES
                                                                  (4, 1, 1), (4, 2, 2), (4, 3, 3), (4, 4, 4);

-- SEGMENTS
INSERT INTO segment (station_1_id, station_2_id) VALUES
                                                     (1,  2),   -- Castle       <-> Fountain
                                                     (2,  3),   -- Fountain     <-> Museum
                                                     (3,  4),   -- Museum       <-> Shopping Centre
                                                     (4,  5),   -- Shopping Centre <-> Industry
                                                     (5,  6),   -- Industry     <-> Tivoli
                                                     (3,  10),  -- Museum       <-> Park
                                                     (9,  10),  -- University   <-> Park
                                                     (10, 11),  -- Park         <-> Central Station
                                                     (11, 4),   -- Central Station <-> Shopping Centre
                                                     (12, 10),  -- Theatre      <-> Park
                                                     (11, 8),   -- Central Station <-> Stadium
                                                     (8,  7);   -- Stadium      <-> Port

-- EVENTS
INSERT INTO event (event_description, effect) VALUES
                                                  ('Quiet journey',       0),
                                                  ('Wrong platform',     -2),
                                                  ('Kind passenger',     +1),
                                                  ('Empty train',         0),
                                                  ('Full metro',         -3),
                                                  ('Lot of luggage',     -2),
                                                  ('No ticket',          -4),
                                                  ('Free coffee',        +2),
                                                  ('Missed the metro',   -3),
                                                  ('Nice view',          +2),
                                                  ('Flashmob on metro',  +1),
                                                  ('Cold weather',       -1),
                                                  ('Spilled coffee',     -2),
                                                  ('Helped a stranger',  +3),
                                                  ('Free water',         +1);

-- TEST USERS (passwords need to be inserted via createUser in dao.js — plain text passwords can't be hashed here)
-- Placeholder rows with fake hashes just to have data in the table for non-auth queries
INSERT INTO user (username, email, password, salt) VALUES
                                                       ('user1', 'user1@example.com', 'fakehash', 'fakesalt'),
                                                       ('user2',   'user2@example.com',   'fakehash', 'fakesalt');

-- TEST GAMES
INSERT INTO game (user_id, start_station_id, destination_station_id, status, score) VALUES
                                                                                        (1, 12, 7,  'active',   20),  -- User1: Theatre -> Port
                                                                                        (2, 1,  6,  'active',   20),  -- User2:   Castle  -> Tivoli
                                                                                        (1, 9,  6,  'finished', 17);  -- User1: University -> Tivoli (finished)

-- TEST GAME ACTIONS
INSERT INTO gameAction (game_id, step_number, from_station_id, to_station_id, event_id, remaining_coins) VALUES
                                                                                                             (1, 1, 12, 10, 1,    20),  -- Theatre -> Park,             Quiet journey
                                                                                                             (1, 2, 10, 11, 3,    21),  -- Park -> Central Station,     Kind passenger
                                                                                                             (2, 1, 1,  2,  6,    18),  -- Castle -> Fountain,          Lot of luggage
                                                                                                             (3, 1, 9,  10, 8,    22),  -- University -> Park,          Free coffee
                                                                                                             (3, 2, 10, 3,  2,    20),  -- Park -> Museum,              Wrong platform
                                                                                                             (3, 3, 3,  4,  10,   22),  -- Museum -> Shopping Centre,   Nice view
                                                                                                             (3, 4, 4,  5,  5,    19);  -- Shopping Centre -> Industry, Full metro