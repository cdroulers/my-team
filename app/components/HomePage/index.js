// @flow
import React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import withUnstated from "@airship/with-unstated";
import messages from "./messages";
import TeamContainer from "../../stateContainers/teamContainer";
import PlayersContainer from "../../stateContainers/playersContainer";

type HomePageProps = {
  team: TeamContainer,
  players: PlayersContainer,
};

export class HomePage extends React.Component<HomePageProps> {
  componentWillMount() {
    this.props.team.loadTeam();
    this.props.players.loadPlayers();
  }

  render() {
    const { team, players } = this.props;
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
            <li key={x.name}>{x.name}</li>
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
      </section>
    );
  }
}

export default withUnstated(HomePage, {
  team: TeamContainer,
  players: PlayersContainer,
});
