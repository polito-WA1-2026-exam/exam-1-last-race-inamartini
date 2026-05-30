PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS user (
                                    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                                    username TEXT NOT NULL UNIQUE,
                                    email TEXT NOT NULL UNIQUE,
                                    password TEXT NOT NULL,
                                    salt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS station (
                                       station_id INTEGER PRIMARY KEY AUTOINCREMENT,
                                       station_name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS line (
                                    line_id INTEGER PRIMARY KEY AUTOINCREMENT,
                                    line_name TEXT NOT NULL UNIQUE,
                                    color TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS line_station (
                                            line_id INTEGER NOT NULL,
                                            station_id INTEGER NOT NULL,
                                            station_order INTEGER NOT NULL,

                                            PRIMARY KEY (line_id, station_id),

    FOREIGN KEY (line_id) REFERENCES line(line_id),
    FOREIGN KEY (station_id) REFERENCES station(station_id)
    );


CREATE TABLE IF NOT EXISTS segment (
                                       segment_id INTEGER PRIMARY KEY AUTOINCREMENT,
                                       station_1_id INTEGER NOT NULL,
                                       station_2_id INTEGER NOT NULL,

                                       FOREIGN KEY (station_1_id) REFERENCES station(station_id),
    FOREIGN KEY (station_2_id) REFERENCES station(station_id)
    );

CREATE TABLE IF NOT EXISTS event (
                                     event_id INTEGER PRIMARY KEY AUTOINCREMENT,
                                     event_description TEXT NOT NULL,
                                     effect INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS game (
                                    game_id INTEGER PRIMARY KEY AUTOINCREMENT,
                                    user_id INTEGER NOT NULL,
                                    start_station_id INTEGER NOT NULL,
                                    destination_station_id INTEGER NOT NULL,
                                    status TEXT NOT NULL DEFAULT 'active',
                                    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    score INTEGER NOT NULL DEFAULT 20,

                                    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (start_station_id) REFERENCES station(station_id),
    FOREIGN KEY (destination_station_id) REFERENCES station(station_id)
    );

CREATE TABLE IF NOT EXISTS gameAction (
                                           game_action_id INTEGER PRIMARY KEY AUTOINCREMENT,
                                           game_id INTEGER NOT NULL,
                                           step_number INTEGER NOT NULL,
                                           from_station_id INTEGER NOT NULL,
                                           to_station_id INTEGER NOT NULL,
                                           event_id INTEGER,
                                           remaining_coins INTEGER NOT NULL,

                                           FOREIGN KEY (game_id) REFERENCES game(game_id),
    FOREIGN KEY (from_station_id) REFERENCES station(station_id),
    FOREIGN KEY (to_station_id) REFERENCES station(station_id),
    FOREIGN KEY (event_id) REFERENCES event(event_id)
    );

INSERT INTO user VALUES ()