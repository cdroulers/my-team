// @flow
import React from "react";
import { FormattedMessage } from "react-intl";
import { Link, RouteComponentProps } from "react-router-dom";
import withUnstated from "@airship/with-unstated";
import messages from "./messages";
import TeamContainer from "../../stateContainers/teamContainer";
import PlayersContainer from "../../stateContainers/playersContainer";
import MatchesContainer from "../../stateContainers/matchesContainer";

interface HomePageProps extends RouteComponentProps {
  team: TeamContainer;
  players: PlayersContainer;
  matches: MatchesContainer;
}

export class HomePage extends React.Component<HomePageProps> {
  componentWillMount() {
    this.props.team.loadTeam();
    this.props.players.loadPlayers();
  }

  render() {
    const { team, players, matches } = this.props;
    if (team.state.loading || players.state.loading) {
      return <div>loading!</div>;
    }

    return (
      <section>
        <h1>
          <FormattedMessage {...messages.header} />
          <Link to="/test">hai</Link>
          <Link to="/sdfafasd">hai2</Link>
        </h1>
        <input
          name="team-name"
          placeholder="Team name"
          value={team.state.team.name}
          onChange={e => {
            team.setName(e.target.value);
          }}
        />
        <ul>
          {players.state.players.map(x => (
            <li key={x.id}>{x.name}</li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => {
            // eslint-disable-next-line no-alert
            const name = prompt("Player name:");
            if (name) {
              players.addPlayer(name);
            }
          }}>
          Add player
        </button>
        <button
          type="button"
          onClick={async () => {
            const m = await matches.beginMatch(players.state.players.map(x => x.id));
            this.props.history.push(`/matches/${m.id}`);
          }}>
          Start match
        </button>
      </section>
    );
  }
}

export default withUnstated(HomePage, {
  team: TeamContainer,
  players: PlayersContainer,
  matches: MatchesContainer,
});
