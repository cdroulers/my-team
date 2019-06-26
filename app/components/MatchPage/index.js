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
    if (!match.match) {
      this.setState({ loading: false });
    } else {
      this.props.players.loadPlayers(Object.keys(match.match.players.totals));
      const statePlayers = Object.keys(match.match.players.totals).reduce(
        (obj, p) => ({ ...obj, [p]: {} }),
        {},
      );

      this.setState({ loading: false, players: statePlayers });
    }
  }

  componentWillUnmount() {
    this.props.matchContainer.unloadMatch();
  }

  state = {
    loading: true,
    players: {},
  };

  render() {
    const { matchContainer, players } = this.props;
    if (this.state.loading || matchContainer.state.loading || players.state.loading) {
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
        [current.id]: {
          ...current,
          positions: matchContainer.state.match.players.totals[current.id].positions,
        },
      }),
      {},
    );

    const m = matchContainer.state.match;
    const isEnded = Boolean(m.endedAt);

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
        <div>
          <button type="button" onClick={() => this.end()} disabled={isEnded}>
            End match
          </button>
          <button type="button" onClick={() => this.doSwap()} disabled={isEnded}>
            SWAP!
          </button>
        </div>
        <h2>On field:</h2>
        <ul>
          {m.players.onField.map(x => (
            <li key={x.playerId}>
              {playerMap[x.playerId].name}{" "}
              <small>
                (<FormattedTimeSpan seconds={x.timePlayed} excludeHours />)
              </small>{" "}
              {x.position && <small>(current position: {x.position})</small>}
              <div>
                <button
                  type="button"
                  disabled={isEnded}
                  onClick={() => matchContainer.setReadyForBench(x.playerId, !x.readyForBench)}>
                  {x.readyForBench ? "cancel ready for bench" : "Ready for bench"}
                </button>
              </div>
            </li>
          ))}
        </ul>
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
                    Goalie (
                    <FormattedTimeSpan
                      seconds={playerMap[x.playerId].positions.Goalie.timePlayed}
                      excludeHours
                    />{" "}
                    x {playerMap[x.playerId].positions.Goalie.numberOfShifts})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      matchContainer.setNextPosition(x.playerId, "Offense");
                      this.setSwapping(x.playerId, false);
                    }}>
                    Offense (
                    <FormattedTimeSpan
                      seconds={playerMap[x.playerId].positions.Offense.timePlayed}
                      excludeHours
                    />{" "}
                    x {playerMap[x.playerId].positions.Offense.numberOfShifts})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      matchContainer.setNextPosition(x.playerId, "Defense");
                      this.setSwapping(x.playerId, false);
                    }}>
                    Defense (
                    <FormattedTimeSpan
                      seconds={playerMap[x.playerId].positions.Defense.timePlayed}
                      excludeHours
                    />{" "}
                    x {playerMap[x.playerId].positions.Defense.numberOfShifts})
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    disabled={isEnded}
                    onClick={() => this.setSwapping(x.playerId, true)}>
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
          <code>{JSON.stringify(playerMap, null, 2)}</code>
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

  doSwap() {
    this.props.matchContainer.swapAll();
  }

  end() {
    this.props.matchContainer.endMatch();
  }
}

export default withUnstated(MatchPage, {
  matchContainer: MatchContainer,
  players: PlayersContainer,
});
