// @flow
import React from "react";
import { FormattedMessage, defineMessages, FormattedTime } from "react-intl";
import { RouteComponentProps } from "react-router-dom";
import withUnstated from "@airship/with-unstated";
import TeamContainer from "../../stateContainers/teamContainer";
import PlayersContainer from "../../stateContainers/playersContainer";
import MatchesContainer from "../../stateContainers/matchesContainer";
import FormattedDateTime from "../shared/formattedDateTime";

interface HomePageProps extends RouteComponentProps {
  team: TeamContainer;
  players: PlayersContainer;
  matches: MatchesContainer;
}

const messages = defineMessages({
  header: {
    id: `app.components.HomePage.header`,
    defaultMessage: "This is the HomePage container!",
  },
  matches: {
    id: `app.components.HomePage.matches`,
    defaultMessage: "Previous matches",
  },
});

export class HomePage extends React.Component<HomePageProps> {
  state = {
    selectedPlayers: {},
  };

  componentWillMount() {
    this.props.team.loadTeam();
    this.props.players.loadPlayers();
    this.props.matches.loadMatches();
  }

  render() {
    const { team, players, matches } = this.props;
    if (team.state.loading || players.state.loading || matches.state.loading) {
      return <div>loading!</div>;
    }

    return (
      <section>
        <h2>
          <FormattedMessage {...messages.header} />
        </h2>
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
            <li key={x.id}>
              <label>
                <input
                  type="checkbox"
                  onChange={e => {
                    const { checked } = e.target;
                    this.setState(state => {
                      const selectedPlayers = { ...state.selectedPlayers };
                      selectedPlayers[x.id] = checked;
                      return { selectedPlayers };
                    });
                  }}
                  checked={this.state.selectedPlayers[x.id] || false}
                />
                {x.name}
              </label>
            </li>
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
            const playerIds = Object.keys(this.state.selectedPlayers);
            const m = await matches.beginMatch(playerIds);
            this.props.history.push(`/matches/${m.id}`);
          }}>
          Start match
        </button>

        <h2>
          <FormattedMessage {...messages.matches} />
        </h2>
        <ul>
          {matches.state.matches.map(x => (
            <li key={x.id}>
              <a href={"/matches/" + x.id}>
                {x.id} - <FormattedDateTime value={x.startedAt} />{" "}
                {x.endedAt && (
                  <span>
                    {" "}
                    - <FormattedTime value={x.endedAt} />
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </section>
    );
  }
}

export default withUnstated(HomePage, {
  team: TeamContainer,
  players: PlayersContainer,
  matches: MatchesContainer,
});
