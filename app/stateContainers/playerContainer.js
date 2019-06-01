// @flow

import { Container } from "unstated";

export type Player = {
  id: String,
  name: String,
};

export type PlayerState = {
  loading: Boolean,
  player: Player,
};

const defaultState = {
  loading: false,
  player: null,
};

export function createPlayer(name: String) {
  return {
    id: Math.random()
      .toString()
      .split(".")[1],
    name,
  };
}

export default class PlayerContainer extends Container<PlayerState> {
  constructor() {
    super();

    this.state = { ...defaultState };
  }
}
