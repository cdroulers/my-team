// @flow

import { Container } from "unstated";

export type TeamState = {
  name: string,
  players: [
    {
      name: string,
    },
  ],
};

const defaultState = {
  name: "",
  players: [],
};

export default class TeamContainer extends Container<TeamState> {
  constructor() {
    super();

    const currentData = localStorage.getItem("my-team:metadata");

    this.state = currentData ? JSON.parse(currentData) : defaultState;
    this.state = {
      ...defaultState,
      ...this.state,
    };
  }

  storeState(): void {
    localStorage.setItem("my-team:metadata", JSON.stringify(this.state));
  }

  setName(name: string): void {
    this.setState({ name }, () => this.storeState());
  }

  addPlayer(name: string): void {
    this.setState(
      state => ({
        players: state.players.concat([{ name }]),
      }),
      () => this.storeState(),
    );
  }
}
