// @flow

import { Container } from "unstated";
import { Player, createPlayer, storePlayer, loadPlayer } from "./playerContainer";

export type PlayersState = {
  loading: boolean,
  players: [Player],
};

const defaultState = {
  loading: true,
  players: [],
};

export default class PlayersContainer extends Container<PlayersState> {
  constructor() {
    super();

    const state: PlayersState = { ...defaultState };
    this.state = state;
  }

  loadPlayers(ids: [String]): Promise<PlayersState> {
    return new Promise(resolve => {
      this.setState({ loading: true }, () => {
        const results: [Player] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.startsWith("player:")) {
            const player = loadPlayer(JSON.parse(localStorage.getItem(key)));
            results.push(player);
          }
        }

        const newState = { loading: false, players: results };

        if (ids && ids.length > 0) {
          newState.players = newState.players.filter(x => ids.indexOf(x.id) >= 0);
        }

        this.setState(newState);
        resolve(newState);
      });
    });
  }

  addPlayer(name: string): void {
    const newPlayer = createPlayer(name);
    this.setState(
      state => ({
        players: state.players.concat([newPlayer]),
      }),
      () => storePlayer(newPlayer),
    );
  }
}
