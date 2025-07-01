import { formatDuration } from "../lib.ts";
import type { Duration } from "../types.ts";

export const DurationString = (props: { duration: Duration }) => {
	return <span>{formatDuration(props.duration)}</span>;
};
