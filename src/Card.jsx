import { onMount, createSignal, createEffect } from "solid-js";
import "./Card.css";

export const Card = (props) => {
	const [config, setConfig] = createSignal(props.config || {});
    const [entity, setEntity] = createSignal();

	Card.prototype.setConfig = (newConfig) => {
		setConfig(newConfig);
	};

    createEffect(() => {
        if (Object.hasOwn(config(), 'entity')) {
            setEntity(config().entity)
        } else {
            setEntity(undefined)
        }
    })

	onMount(() => {
		console.log(props);
		if (window.hass) {
			console.log(window.hass);
			setTimer(window.hass.states[props.id]);
		}
	});
	return <div>Examples</div>;
};
