import { createSignal, createEffect } from "solid-js";
import style from "./Card.css";

export const Card = (props) => {
	const [entity, setEntity] = createSignal();

	createEffect(() => {
		if (!Object.hasOwn(props.config, "entity")) {
			setEntity(undefined);
		} else {
			setEntity(props.config.entity);
		}
	});

	createEffect(() => {
		console.log(props.hass.states);
	});

	return (
		<>
			<style>{style}</style>
			<ha-card classList={{'bg-red-900' : !entity()}}>Entitiy: {entity()}</ha-card>
		</>
	);
};
