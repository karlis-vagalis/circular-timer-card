import {
	createEffect,
	createSignal,
	Match,
	mergeProps,
	Show,
	Switch,
} from "solid-js";
import { createStore } from "solid-js/store";
import style from "./Card.css";
import { DurationString } from "./components/DurationString.tsx";
import { ProgressBar } from "./components/ProgressBar.tsx";
import { ProgressCircle } from "./components/ProgressCircle.tsx";
import { Warning } from "./components/Warning.tsx";
import { entityExistsAndIsValid, getRemaining } from "./lib.ts";
import type { Config, Duration } from "./types.ts";

const defaultConfig: Config = {
	layout: "circle",
	progress: {
		direction: "countdown",
		bins: 36,
	},
	info: {
		primary: "",
		secondary: "",
	},
	icon: "",
	style: {
		corner_radius: 0,
		padding: 0,
		color: "",
		empty_color: "",
	},
	actions: {
		tap: "",
		hold: "",
		double_tap: "",
	},
};

export const Card = (props: Config & { hass: any }) => {
	props = mergeProps(defaultConfig, props);
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

	createEffect(() => {
		if (props.entity) {
			setRemaining(getRemaining(props.entity, props.hass));
		}
	});

	const handleClick = () => {
		if (props.entity) {
			props.hass.callService(
				"timer",
				props.hass.states[props.entity].state === "active" ? "pause" : "start",
				{ entity_id: props.entity },
			);
		}
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
				classList={{ "bg-red-900": !entity() }}
			>
				<Show when={!entity()}>
					<Warning message="Card configuration does not contain 'entity' setting or the provided ID is invalid!" />
				</Show>

				<Show when={entity()}>
					<Switch>
						<Match when={props.layout === "circle"}>
							<ProgressCircle config={props.config} />
						</Match>
						<Match when={props.layout === "minimal"}>
							<DurationString duration={remaining.duration} />
							<ProgressBar />
						</Match>
					</Switch>
				</Show>
			</ha-card>
		</>
	);
};
