import { onMount, createSignal, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
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

	return <div>Entitiy: {entity()}</div>;
};
