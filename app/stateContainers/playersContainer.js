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

  loadPlayers(): Promise<PlayersState> {
    return new Promise(resolve => {
      this.setState({ loading: true }, () => {
        const currentData = localStorage.getItem("my-team:players");
        const newState = { loading: false, players: [] };
        if (currentData) {
          newState.players = JSON.parse(currentData);
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
