import { createEffect, Match, mergeProps, Switch } from "solid-js";
import { createStore } from "solid-js/store";
import style from "./Card.css";
import { DurationString } from "./components/DurationString.tsx";
import { ProgressBar } from "./components/ProgressBar.tsx";
import { ProgressCircle } from "./components/ProgressCircle.tsx";
import { getRemaining } from "./lib.ts";
import type { Config, Duration } from "./types.ts";

const primaryTextColor = getComputedStyle(
	document.documentElement,
).getPropertyValue("--primary-text-color");
const primaryColor = getComputedStyle(
	document.documentElement,
).getPropertyValue("--primary-color");

const defaultConfig: Partial<Config> = {
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
		corner_radius: 1,
		bin_padding: 1,
		color: primaryColor,
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

	const [derived, setDerived] = createStore<{
		remaining: { progress: number; duration: Duration };
		colors: string[];
	}>({
		colors: [props.primaryColor, props.primaryColor],
		remaining: {
			progress: 0,
			duration: {
				seconds: 0,
				minutes: 0,
				hours: 0,
			},
		},
	});

	createEffect(() => {
		setDerived("remaining", getRemaining(props.entity, props.hass));
	});

	createEffect(() => {
		setDerived("colors", )
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
						<ProgressCircle {...props} />
					</Match>
					<Match when={props.layout === "minimal"}>
						<DurationString duration={derived.remaining.duration} />
						<ProgressBar />
					</Match>
				</Switch>
			</ha-card>
		</>
	);
};
