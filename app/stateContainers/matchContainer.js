// @flow

import { Container } from "unstated";

export type Match = {
  id: String,
  startedAt: Date,
  endedAt: ?Date,
  players: MatchPlayers,
};

type PositionType = "Bench" | "Offense" | "Defense" | "Goalie";

export type Position = {
  type: PositionType,
  timePlayed: number,
  numberOfShifts: number,
};

export type Positions = {
  Bench: Position,
  Offense: Position,
  Defense: Position,
  Goalie: Position,
};

export type PlayerMatch = {
  playerId: String,
  positions: Positions,
};

export type OnFieldPlayer = {
  playerId: String,
  position: PositionType,
  timePlayed: number,
  readyForBench: Boolean,
};

export type OnBenchPlayer = {
  playerId: String,
  nextPosition: ?PositionType,
  timeBenched: number,
};

export type MatchPlayers = {
  totals: { String: PlayerMatch },
  onField: [OnFieldPlayer],
  onBench: [OnBenchPlayer],
};

export function loadMatch(obj: any): Match {
  const result = { ...obj };
  result.startedAt = new Date(result.startedAt);
  if (result.endedAt) {
    result.endedAt = new Date(result.endedAt);
  }

  return result;
}

export function createMatch(playerIds: [String]): Match {
  return {
    id: Math.random()
      .toString()
      .split(".")[1],
    startedAt: new Date(),
    endedAt: null,
    players: {
      totals: playerIds
        .map(x => {
          const result: PlayerMatch = {
            playerId: x,
            positions: {
              Bench: { type: "Bench", timePlayed: 0, numberOfShifts: 0 },
              Offense: { type: "Offense", timePlayed: 0, numberOfShifts: 0 },
              Defense: { type: "Defense", timePlayed: 0, numberOfShifts: 0 },
              Goalie: { type: "Goalie", timePlayed: 0, numberOfShifts: 0 },
            },
          };
          return result;
        })
        .reduce((obj, p) => ({ ...obj, [p.playerId]: p }), {}),
      onField: [],
      onBench: playerIds.map(x => {
        const result: OnBenchPlayer = {
          playerId: x,
          nextPosition: null,
          timeBenched: 0,
        };
        return result;
      }),
    },
  };
}

export type MatchState = {
  loading: boolean,
  match: Match,
};

const defaultState: MatchState = {
  loading: true,
  match: null,
};

export default class MatchContainer extends Container<MatchState> {
  constructor() {
    super();

    this.state = { ...defaultState };
  }

  unloadMatch() {
    clearInterval(this.updateTimesInterval);
  }

  loadMatch(matchId: String): Promise<MatchState> {
    return new Promise(resolve => {
      this.setState({ loading: true }, () => {
        const currentData = localStorage.getItem(`match:${matchId}`);
        const newState: MatchState = { loading: false, match: null };
        if (currentData) {
          newState.match = loadMatch(JSON.parse(currentData));
        }

        this.setState(newState);
        resolve(newState);
        if (newState.match && !newState.match.endedAt) {
          this.counter = 0;
          this.updateTimesInterval = setInterval(() => this.updateTimes(), 1000);
        }
      });
    });
  }

  setNextPosition(playerId: String, position: PositionType) {
    this.setState(
      state => {
        const onBench = state.match.players.onBench.map(x => ({
          ...x,
          nextPosition: x.playerId === playerId ? position : x.nextPosition,
        }));
        return {
          ...state,
          match: {
            ...state.match,
            players: {
              ...state.match.players,
              onBench,
            },
          },
        };
      },
      () => {
        storeMatch(this.state.match);
      },
    );
  }

  setReadyForBench(playerId: String, ready: Boolean) {
    this.setState(
      state => {
        const onField = state.match.players.onField.map(x => ({
          ...x,
          readyForBench: x.playerId === playerId ? ready : x.readyForBench,
        }));
        return {
          ...state,
          match: {
            ...state.match,
            players: {
              ...state.match.players,
              onField,
            },
          },
        };
      },
      () => {
        storeMatch(this.state.match);
      },
    );
  }

  swapAll() {
    this.setState(
      state => {
        const fromBench = state.match.players.onBench.filter(x => Boolean(x.nextPosition));
        const stayBench = state.match.players.onBench.filter(x => !x.nextPosition);
        const fromField = state.match.players.onField.filter(x => x.readyForBench);
        const stayField = state.match.players.onField.filter(x => !x.readyForBench);

        const totals = { ...state.match.players.totals };
        fromBench.forEach(x => {
          totals[x.playerId].positions.Bench.timePlayed = x.timeBenched;
          totals[x.playerId].positions[x.nextPosition].numberOfShifts++;
        });

        fromField.forEach(x => {
          totals[x.playerId].positions[x.position].timePlayed = x.timePlayed;
          totals[x.playerId].positions.Bench.numberOfShifts++;
        });
        const toField: [OnFieldPlayer] = fromBench.map(x => ({
          playerId: x.playerId,
          position: x.nextPosition,
          timePlayed: state.match.players.totals[x.playerId].positions[x.nextPosition].timePlayed,
          readyForBench: false,
        }));
        const toBench: [OnBenchPlayer] = fromField.map(x => ({
          playerId: x.playerId,
          nextPosition: null,
          timeBenched: state.match.players.totals[x.playerId].positions.Bench.timePlayed,
        }));
        return {
          ...state,
          match: {
            ...state.match,
            players: {
              ...state.match.players,
              onBench: stayBench.concat(toBench),
              onField: stayField.concat(toField),
            },
          },
        };
      },
      () => {
        storeMatch(this.state.match);
      },
    );
  }

  cancelNextPosition(playerId: String) {
    return this.setNextPosition(playerId, null);
  }

  endMatch() {
    this.setState(
      state => ({
        ...state,
        match: {
          ...state.match,
          endedAt: state.match.endedAt || new Date(),
        },
      }),
      () => {
        storeMatch(this.state.match);
      },
    );

    clearInterval(this.updateTimesInterval);
  }

  updateTimes() {
    this.counter++;
    this.setState(
      state => {
        const onField = state.match.players.onField.map(x => ({
          ...x,
          timePlayed: x.timePlayed + 1,
        }));
        const onBench = state.match.players.onBench.map(x => ({
          ...x,
          timeBenched: x.timeBenched + 1,
        }));
        return {
          ...state,
          match: {
            ...state.match,
            players: {
              ...state.match.players,
              onField,
              onBench,
            },
          },
        };
      },
      () => {
        if (this.counter % 5 === 0) {
          storeMatch(this.state.match);
        }
      },
    );
  }
}

export function storeMatch(match: Match): Promise<Match> {
  return new Promise(resolve => {
    localStorage.setItem(`match:${match.id}`, JSON.stringify(match));
    resolve(match);
  });
}
