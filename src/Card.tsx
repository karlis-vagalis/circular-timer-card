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
import { Warning } from "./components/Warning.tsx";
import { entityExistsAndIsValid, getRemaining } from "./lib.ts";
import type { Config } from "./types.ts";

const defaultConfig: Config = {
	layout: "circle",
	progress: {
		direction: "countdown",
		count: 36,
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

export const Card = (props: { config: Config; hass: any }) => {
	props = mergeProps(
		{
			config: defaultConfig,
		},
		props,
	);
	const [remaining, setRemaining] = createStore({
		progress: 0,
		duration: {
			seconds: 0,
			minutes: 0,
			hours: 0,
		},
	});
	const [entity, setEntity] = createSignal<string | undefined>();

	createEffect(() => {
		const entityId = props.config.entity;
		setEntity(
			entityExistsAndIsValid(props.config, props.hass) ? entityId : undefined,
		);
	});

	createEffect(() => {
		setRemaining(getRemaining(entity(), props.hass));
	});

	const handleClick = () => {
		props.hass.callService(
			"timer",
			props.hass.states[entity()].state === "active" ? "pause" : "start",
			{ entity_id: entity() },
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
				classList={{ "bg-red-900": !entity() }}
			>
				<Show when={!entity()}>
					<Warning message="Card configuration does not contain 'entity' setting or the provided ID is invalid!" />
				</Show>
				<Switch>
					<Match when={props.config.layout === "circle"}></Match>
				</Switch>
				<Show when={entity()}>
					<DurationString duration={remaining.duration} />
					<ProgressBar />
				</Show>
			</ha-card>
		</>
	);
};
