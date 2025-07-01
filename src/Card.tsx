import {
	createSignal,
	createEffect,
	mergeProps,
	Show,
	Match,
	Switch,
} from "solid-js";
import style from "./Card.css";
import { Warning } from "./components/Warning";
import { entityExistsAndIsValid, getRemaining } from "./lib.ts";
import { createStore } from "solid-js/store";
import { DurationString } from "./components/DurationString.tsx";
import { ProgressBar } from "./components/ProgressBar.tsx";
import { Config } from "./types.ts";

export const Card = (props: { config: Config }) => {
	props = mergeProps(
		{
			config: {
				style: "circle",
				progress: {
					count: 1,
				},
				tap_action: "toggle",
			},
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
	const [entity, setEntity] = createSignal();

	createEffect(() => {
		const entityId = props.config?.entity;
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
					<Match when={props.config.style === "circle"}></Match>
				</Switch>
				<Show when={entity()}>
					<DurationString duration={remaining.duration} />
					<ProgressBar />
				</Show>
			</ha-card>
		</>
	);
};
