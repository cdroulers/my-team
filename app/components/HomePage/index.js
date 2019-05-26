// @flow
import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { Container } from "unstated";
import withUnstated from "@airship/with-unstated";
import messages from "./messages";
import TeamContainer, { TeamState } from "../../stateContainers/teamContainer";

function HomePage({ team }: { team: Container<TeamState> }) {
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
        value={team.state.name}
        onChange={e => {
          team.setName(e.target.value);
        }}
      />
      <ul>
        {team.state.players.map(x => (
          <li key={x.name}>{x.name}</li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => {
          // eslint-disable-next-line no-alert
          const name = prompt("Player name:");
          if (name) {
            team.addPlayer(name);
          }
        }}>
        Add player
      </button>
    </section>
  );
}

HomePage.propTypes = {
  team: PropTypes.any,
};

export default withUnstated(HomePage, {
  team: TeamContainer,
});
