// @flow

import { Container } from "unstated";

export type Match = {
  id: String,
  startedAt: Date,
  endedAt: ?Date,
  players: [PlayerMatch],
};

export type PlayerMatch = {
  playerId: String,
  timePlayed: number,
};

export function createMatch(playerIds: [String]): Match {
  return {
    id: Math.random()
      .toString()
      .split(".")[1],
    startedAt: new Date(),
    endedAt: null,
    players: playerIds.map(x => ({ playerId: x, timePlayed: 0 })),
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
