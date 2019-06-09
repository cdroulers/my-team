// @flow
import React from "react";
import { FormattedMessage, defineMessages } from "react-intl";
import { RouteComponentProps } from "react-router-dom";
import withUnstated from "@airship/with-unstated";
import MatchContainer from "../../stateContainers/matchContainer";
import { Player } from "../../stateContainers/playerContainer";
import PlayersContainer from "../../stateContainers/playersContainer";
import FormattedDateTime from "../shared/formattedDateTime";
import FormattedTimeSpan from "../shared/formattedTimeSpan";

interface MatchPageProps extends RouteComponentProps<{ matchId: String }> {
  matchContainer: MatchContainer;
  players: PlayersContainer;
}

export const scope = "app.containers.HomePage";

const messages = defineMessages({
  header: {
    id: `app.components.MatchPage.header`,
    defaultMessage: "Match ID #{id}",
  },
});

export class MatchPage extends React.Component<MatchPageProps> {
  async componentWillMount() {
    const match = await this.props.matchContainer.loadMatch(this.props.match.params.matchId);
    this.props.players.loadPlayers(Object.keys(match.match.players.totals));
    const statePlayers = Object.keys(match.match.players.totals).reduce(
      (obj, p) => ({ ...obj, [p]: {} }),
      {},
    );

    this.setState({ players: statePlayers });
  }

  state = {
    players: {},
  };

  render() {
    const { matchContainer, players } = this.props;
    if (matchContainer.state.loading || players.state.loading) {
      return <div>loading!</div>;
    }

    if (!matchContainer.state.match) {
      return <div>Match not found</div>;
    }

    const selectedPlayers = players.state.players.filter(x =>
      Boolean(matchContainer.state.match.players.totals[x.id]),
    );

    const playerMap: { String: Player } = selectedPlayers.reduce(
      (prev, current) => ({
        ...prev,
        [current.id]: current,
      }),
      {},
    );

    const m = matchContainer.state.match;

    return (
      <section>
        <h1>
          <FormattedMessage {...messages.header} values={{ id: m.id }} />
        </h1>
        <ul>
          <li>
            Started at: <FormattedDateTime value={m.startedAt} />
          </li>
          {m.endedAt && (
            <li>
              Ended at: <FormattedDateTime value={m.endedAt} />
            </li>
          )}
        </ul>
        <h2>On field:</h2>
        <ul />
        <h2>On bench:</h2>
        <ul>
          {m.players.onBench.map(x => (
            <li key={x.playerId}>
              {playerMap[x.playerId].name}{" "}
              <small>
                (<FormattedTimeSpan seconds={x.timeBenched} excludeHours />)
              </small>{" "}
              {x.nextPosition && <small>(next position: {x.nextPosition})</small>}
              {this.state.players[x.playerId].swapping ? (
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      matchContainer.setNextPosition(x.playerId, "Goalie");
                      this.setSwapping(x.playerId, false);
                    }}>
                    Goalie
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      matchContainer.setNextPosition(x.playerId, "Offense");
                      this.setSwapping(x.playerId, false);
                    }}>
                    Offense
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      matchContainer.setNextPosition(x.playerId, "Defense");
                      this.setSwapping(x.playerId, false);
                    }}>
                    Defense
                  </button>
                </div>
              ) : (
                <div>
                  <button type="button" onClick={() => this.setSwapping(x.playerId, true)}>
                    Ready swap
                  </button>
                </div>
              )}
              {x.nextPosition && (
                <div>
                  <button
                    type="button"
                    onClick={() => matchContainer.cancelNextPosition(x.playerId)}>
                    Cancel swap
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
        <pre>
          <code>{JSON.stringify(matchContainer.state.match, null, 2)}</code>
        </pre>
        <pre>
          <code>{JSON.stringify(selectedPlayers, null, 2)}</code>
        </pre>
      </section>
    );
  }

  setSwapping(playerId: String, swapping: Boolean) {
    this.setState(state => ({
      ...state,
      players: {
        ...state.players,
        [playerId]: {
          ...state.players[playerId],
          swapping,
        },
      },
    }));
  }
}

export default withUnstated(MatchPage, {
  matchContainer: MatchContainer,
  players: PlayersContainer,
});
