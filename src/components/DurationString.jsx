import { formatDuration } from "../lib.js";

export const DurationString = (props) => {
  const style = () => (props.textColor ? `color: ${props.textColor}` : undefined);
  return <span style={style()}>{formatDuration(props.duration)}</span>;
};
