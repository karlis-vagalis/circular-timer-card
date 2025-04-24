import { onMount, createSignal } from "solid-js";
import "./Card.css";

export const Card = (props) => {

    const [timer, setTimer] = createSignal();

    onMount(() => {
        if (window.hass) {
            console.log(window.hass)
            setTimer(window.hass.states[props.id]);
        }
    })

    console.log(props, hass);
	return <div>Examples</div>;
};
