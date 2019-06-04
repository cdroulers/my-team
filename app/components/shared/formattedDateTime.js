import React from "react";

import { FormattedDate, FormattedTime } from "react-intl";

export default function FormattedDateTime(props) {
  return (
    <time dateTime={props.value.toISOString()}>
      <FormattedDate wat="lol" {...props} /> <FormattedTime {...props} />
    </time>
  );
}

FormattedDateTime.propTypes = FormattedDate.propTypes;
