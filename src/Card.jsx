import { createSignal, createEffect } from "solid-js";
import "./Card.css";

export const Card = (props) => {

    const [entity, setEntity] = createSignal();

    createEffect(() => {
        if (Object.hasOwn(props.config, 'entity')) {
            setEntity(props.config.entity)
        } else {
            setEntity(undefined)
        }
    })

    createEffect(() => {
        console.log(props.hass.states)
    })

	return <div>Entitiy: {entity()}</div>;
};
