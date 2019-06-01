// @flow

import { Container } from "unstated";

export type Player = {
  name: string,
};

export type PlayerState = {
  loading: boolean,
  player: Player,
};

const defaultState = {
  loading: false,
  player: null,
};

export default class PlayerContainer extends Container<PlayerState> {
  constructor() {
    super();

    this.state = { ...defaultState };
  }
}
