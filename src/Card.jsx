import { onMount, createSignal, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import "./Card.css";

export const Card = (props) => {
	const [config, setConfig] = createStore({});
    const [entity, setEntity] = createSignal();

	Card.prototype.setConfig = (newConfig) => {
		setConfig(newConfig);
	};

    createEffect(() => {
        if (Object.hasOwn(config, 'entity')) {
            setEntity(config.entity)
        } else {
            setEntity(undefined)
        }
    })

	onMount(() => {
		console.log(props);
		if (window.hass) {
			console.log(window.hass);
		}
	});
	return <div>Examples</div>;
};
