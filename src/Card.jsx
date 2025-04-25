import { createSignal, createEffect } from "solid-js";
import "./Card.css?inline";

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

	return <ha-card>Entitiy: {entity()}</ha-card>;
};
