import { formatDuration } from "../lib.ts";

export const DurationString = (props) => {
  return <span>{formatDuration(props.duration)}</span>;
};
