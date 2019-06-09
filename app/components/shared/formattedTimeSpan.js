import React from "react";

export type FormattedTimeSpanProps = {
  seconds: Number,
  excludeHours: Boolean,
};

export default function FormattedTimeSpan({
  seconds: totalSeconds,
  excludeHours,
}: FormattedTimeSpanProps) {
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds - hours * 3600) / 60);
  let seconds = totalSeconds - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  const display = (excludeHours ? "" : hours + ":") + minutes + ":" + seconds;
  return <time dateTime={display}>{display}</time>;
}
