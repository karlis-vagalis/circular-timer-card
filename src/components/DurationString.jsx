import { formatDuration } from "../lib.js";

export const DurationString = (props) => {
  return <span>{formatDuration(props.duration)}</span>;
};
