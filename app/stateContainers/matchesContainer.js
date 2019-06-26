// @flow

import { Container } from "unstated";

import { Match, createMatch, storeMatch, loadMatch } from "./matchContainer";

export type MatchesState = {
  loading: boolean,
  matches: [Match],
};

const defaultState = {
  loading: false,
  matches: [],
};

export default class MatchesContainer extends Container<MatchesState> {
  constructor() {
    super();
    const state: MatchesState = { ...defaultState };
    this.state = state;
  }

  loadMatches(): Promise<MatchesState> {
    return new Promise(resolve => {
      this.setState({ loading: true }, () => {
        const results = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.startsWith("match:")) {
            const match = loadMatch(JSON.parse(localStorage.getItem(key)));
            results.push(match);
          }
        }

        const newState = { loading: false, matches: results };
        this.setState(newState);
        resolve(newState);
      });
    });
  }

  beginMatch(playerIds: [String]): Promise<Match> {
    const match = createMatch(playerIds);

    this.setState(
      state => ({
        matches: state.matches.concat(match),
      }),
      () => storeMatch(match),
    );

    return new Promise(resolve => resolve(match));
  }
}
