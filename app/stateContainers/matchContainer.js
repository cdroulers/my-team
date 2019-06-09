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
              Bench: { type: "Bench", timePlayed: 0 },
              Offense: { type: "Offense", timePlayed: 0 },
              Defense: { type: "Defense", timePlayed: 0 },
              Goalie: { type: "Goalie", timePlayed: 0 },
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

  loadMatch(matchId: String): Promise<MatchState> {
    return new Promise(resolve => {
      this.setState({ loading: true }, () => {
        const currentData = localStorage.getItem(`match:${matchId}`);
        const newState = { loading: false, match: null };
        if (currentData) {
          newState.match = JSON.parse(currentData);
          newState.match.startedAt = new Date(newState.match.startedAt);
          if (newState.match.endedAt) {
            newState.match.endedAt = new Date(newState.match.endedAt);
          }
        }

        this.setState(newState);
        resolve(newState);
        this.counter = 0;
        this.updateTimesInterval = setInterval(() => this.updateTimes(), 1000);
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
        if (this.counter % 5 === 0) {
          storeMatch(this.state.match);
        }
      },
    );
  }

  cancelNextPosition(playerId: String) {
    return this.setNextPosition(playerId, null);
  }

  updateTimes() {
    this.counter++;
    this.setState(
      state => {
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
