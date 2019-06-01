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
  componentWillMount() {
    this.props.matchContainer.loadMatch(this.props.match.params.matchId);
    this.props.players.loadPlayers();
  }

  render() {
    const { matchContainer, players } = this.props;
    if (matchContainer.state.loading || players.state.loading) {
      return <div>loading!</div>;
    }

    return (
      <section>
        <h1>
          <FormattedMessage {...messages.header} />
        </h1>
        <pre>
          <code>{JSON.stringify(matchContainer.state.match, null, 2)}</code>
        </pre>
      </section>
    );
  }
}

export default withUnstated(MatchPage, {
  matchContainer: MatchContainer,
  players: PlayersContainer,
});
