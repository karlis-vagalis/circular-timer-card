import { createEffect, createMemo, Match, mergeProps, Switch } from "solid-js";
import { createStore } from "solid-js/store";
import style from "./Card.css";
import { DurationString } from "./components/DurationString.tsx";
import { ProgressBar } from "./components/ProgressBar.tsx";
import { ProgressCircle } from "./components/ProgressCircle.tsx";
import { getColorScale, getRemaining } from "./lib.ts";
import type { Config, Duration } from "./types.ts";

const defaultConfig: Partial<Config> = {
	layout: "circle",
	direction: "countdown",
	bins: 36,
	corner_radius: 1,
	bin_padding: 1,
	empty_bin_color: "#fdfdfd00"
};

export const Card = (props: Config & { hass: any }) => {
	props = mergeProps(defaultConfig, props);

	const colorScale = createMemo(() => {
		return getColorScale(props.color);
	});

	const [remaining, setRemaining] = createStore<{
		progress: number;
		duration: Duration;
	}>({
		progress: 0,
		duration: {
			seconds: 0,
			minutes: 0,
			hours: 0,
		},
	});

	const limitBin = createMemo(() => {
		return Math.floor(props.bins * remaining.progress);
	});

	createEffect(() => {
		setRemaining(getRemaining(props.entity, props.hass));
	});

	const handleClick = () => {
		props.hass.callService(
			"timer",
			props.hass.states[props.entity].state === "active" ? "pause" : "start",
			{ entity_id: props.entity },
		);
	};

	return (
		<>
			<style>{style}</style>
			<ha-card
				onClick={(e) => {
					handleClick(e);
				}}
				onKeyDown={(e) => {
					handleClick(e);
				}}
			>
				<Switch>
					<Match when={props.layout === "circle"}>
						<ProgressCircle
							limitBin={limitBin()}
							colorScale={colorScale()}
							duration={remaining.duration}
							{...props}
						/>
					</Match>
					<Match when={props.layout === "minimal"}>
						<DurationString duration={remaining.duration} />
						<ProgressBar />
					</Match>
				</Switch>
			</ha-card>
		</>
	);
};
