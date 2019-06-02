// @flow

import { Container } from "unstated";
import { Player, createPlayer } from "./playerContainer";

export type PlayersState = {
  loading: boolean,
  players: [Player],
};

const defaultState = {
  loading: false,
  players: [],
};

export default class PlayersContainer extends Container<PlayersState> {
  constructor() {
    super();

    this.state = { ...defaultState };
  }

  loadPlayers(ids: [String]): Promise<PlayersState> {
    return new Promise(resolve => {
      this.setState({ loading: true }, () => {
        const currentData = localStorage.getItem("my-team:players");
        const newState = { loading: false, players: [] };
        if (currentData) {
          newState.players = JSON.parse(currentData);
        }

        if (ids && ids.length > 0) {
          newState.players = newState.players.filter(x => ids.indexOf(x.id) >= 0);
        }

        this.setState(newState);
        resolve(newState);
      });
    });
  }

  storeState(): void {
    localStorage.setItem("my-team:players", JSON.stringify(this.state.players));
  }

  addPlayer(name: string): void {
    this.setState(
      state => ({
        players: state.players.concat([createPlayer(name)]),
      }),
      () => this.storeState(),
    );
  }
}
