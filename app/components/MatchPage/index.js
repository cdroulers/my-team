// @flow
import React from "react";
import { FormattedMessage, defineMessages } from "react-intl";
import { RouteComponentProps } from "react-router-dom";
import withUnstated from "@airship/with-unstated";
import MatchContainer from "../../stateContainers/matchContainer";
import PlayersContainer from "../../stateContainers/playersContainer";

interface MatchPageProps extends RouteComponentProps<{ matchId: String }> {
  matchContainer: MatchContainer;
  players: PlayersContainer;
}

export const scope = "app.containers.HomePage";

const messages = defineMessages({
  header: {
    id: `app.components.MatchPage.header`,
    defaultMessage: "A MATCH!",
  },
});

export class MatchPage extends React.Component<MatchPageProps> {
  async componentWillMount() {
    const match = await this.props.matchContainer.loadMatch(this.props.match.params.matchId);
    this.props.players.loadPlayers(match.match.players.map(x => x.playerId));
  }

  render() {
    const { matchContainer, players } = this.props;
    if (matchContainer.state.loading || players.state.loading) {
      return <div>loading!</div>;
    }

    if (!matchContainer.state.match) {
      return <div>Match not found</div>;
    }

    const selectedPlayers = players.state.players.filter(
      x => matchContainer.state.match.players.filter(p => p.playerId === x.id).length > 0,
    );

    return (
      <section>
        <h1>
          <FormattedMessage {...messages.header} />
        </h1>
        <pre>
          <code>{JSON.stringify(matchContainer.state.match, null, 2)}</code>
        </pre>
        <pre>
          <code>{JSON.stringify(selectedPlayers, null, 2)}</code>
        </pre>
      </section>
    );
  }
}

export default withUnstated(MatchPage, {
  matchContainer: MatchContainer,
  players: PlayersContainer,
});
