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

export function createPlayer(name: String) {
  return {
    id: Math.random()
      .toString()
      .split(".")[1],
    name,
  };
}

export function loadPlayer(obj: any): Player {
  const result = { ...obj };

  // Nothing to parse here, but future proof!
  return result;
}

export function storePlayer(player: Player): Promise<Player> {
  return new Promise(resolve => {
    localStorage.setItem(`player:${player.id}`, JSON.stringify(player));
    resolve(player);
  });
}

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
