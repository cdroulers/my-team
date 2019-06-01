// @flow

import { Container } from "unstated";

export type TeamState = {
  loading: boolean,
  team: Team,
};

export type Team = {
  name: string,
};

const defaultState = {
  loading: false,
  team: { name: "" },
};

export default class TeamContainer extends Container<TeamState> {
  constructor() {
    super();
    this.state = { ...defaultState };
  }

  loadTeam(): Promise<TeamState> {
    return new Promise(resolve => {
      this.setState({ loading: true }, () => {
        const currentData = localStorage.getItem("my-team:metadata");
        const newState = { loading: false, team: { name: "" } };
        if (currentData) {
          newState.team = JSON.parse(currentData);
        }

        this.setState(newState);
        resolve(newState);
      });
    });
  }

  storeState(): void {
    localStorage.setItem("my-team:metadata", JSON.stringify(this.state.team));
  }

  setName(name: string): void {
    this.setState({ team: { name } }, () => this.storeState());
  }
}
