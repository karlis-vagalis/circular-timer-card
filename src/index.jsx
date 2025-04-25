import pkg from "../package.json";
import { Card } from "./Card.jsx";
import { render } from "solid-js/web";
import { createStore } from "solid-js/store";

const name = pkg.name;


const [config, setConfig] = createStore();
const [hass, setHass] = createStore()

class SolidCard extends HTMLElement {
	
	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: "open" });
	}

	connectedCallback() {
		render(
			() => <Card config={config} hass={hass} />,
			this.shadow,
		);
	}

	set hass(hass) {
		setHass(hass)
	}

	setConfig(config) {
		setConfig(config)
	}
}

if (!customElements.get(name)) {
	customElements.define(name, SolidCard);
}

console.info(
	`%c ${name} | Version ${pkg.version} `,
	"color: white; font-weight: bold; background: #FF4F00",
);
