import { onMount, createSignal } from "solid-js";
import "./Card.css";

export const Card = (props) => {

    const [timer, setTimer] = createSignal();

    onMount(() => {
        console.log(props)
        if (window.hass) {
            console.log(window.hass)
            setTimer(window.hass.states[props.id]);
        }
    })
	return <div>Examples</div>;
};
