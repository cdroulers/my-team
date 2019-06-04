// @flow

import { Container } from "unstated";

export type Match = {
  id: String,
  startedAt: Date,
  endedAt: ?Date,
  players: [PlayerMatch],
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

export function createMatch(playerIds: [String]): Match {
  return {
    id: Math.random()
      .toString()
      .split(".")[1],
    startedAt: new Date(),
    endedAt: null,
    players: playerIds.map(x => {
      const result: PlayerMatch = { playerId: x, timePlayed: 0 };
      return result;
    }),
  };
}

export type MatchState = {
  loading: boolean,
  match: Match,
};

const defaultState: MatchState = {
  loading: false,
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
      });
    });
  }
}
