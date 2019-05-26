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
      </h1>
      <input
        name="team-name"
        placeholder="Team name"
        value={team.state.name}
        onChange={e => {
          team.setName(e.target.value);
        }}
      />
    </section>
  );
}

HomePage.propTypes = {
  team: PropTypes.any,
};

export default withUnstated(HomePage, {
  team: TeamContainer,
});
