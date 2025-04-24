import { onMount, createSignal } from "solid-js";
import "./Card.css";

export const Card = (props) => {
	const [config, setConfig] = createSignal(props.config || {});
	const [timer, setTimer] = createSignal();

	Card.prototype.setConfig = (newConfig) => {
		setConfig(newConfig);
	};

	onMount(() => {
		console.log(props);
		if (window.hass) {
			console.log(window.hass);
			setTimer(window.hass.states[props.id]);
		}
	});
	return <div>Examples</div>;
};
