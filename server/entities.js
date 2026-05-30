function User(user_id, username, email) {
    this.user_id = user_id;
    this.username = username;
    this.email = email;
}

function Game(game_id, user_id, start_station_id, destination_station_id, status = "active", created_at, score = 20) {
    this.game_id = game_id;
    this.user_id = user_id;
    this.start_station_id = start_station_id;
    this.destination_station_id = destination_station_id;
    this.status = status;
    this.created_at = created_at;
    this.score = score;
}

function GameAction(game_action_id, game_id, step_number, from_station_id, to_station_id, event_id, remaining_coins) {
    this.game_action_id = game_action_id;
    this.game_id = game_id;
    this.step_number = step_number;
    this.from_station_id = from_station_id;
    this.to_station_id = to_station_id;
    this.event_id = event_id;
    this.remaining_coins = remaining_coins;
}

function Event(event_id, event_description, effect) {
    this.event_id = event_id;
    this.event_description = event_description;
    this.effect = effect;
}

function Station(station_id, station_name) {
    this.station_id = station_id;
    this.station_name = station_name;
}

function Segment(segment_id, station_1_id, station_2_id) {
    this.segment_id = segment_id;
    this.station_1_id = station_1_id;
    this.station_2_id = station_2_id;
}

function Line(line_id, line_name, color, stations = []) {
    this.line_id = line_id;
    this.line_name = line_name;
    this.color = color;
    this.stations = stations;
}

function LineStation(line_id, station_id, station_order) {
    this.line_id = line_id;
    this.station_id = station_id;
    this.station_order = station_order;
}

export {
    User,
    Game,
    GameAction,
    Event,
    Station,
    Segment,
    Line,
    LineStation
};