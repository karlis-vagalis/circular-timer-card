import { createStore } from "solid-js/store";
import { Show } from "solid-js";
import { render } from "solid-js/web";
import hacs from "../hacs.json";
import pkg from "../package.json";
import { Card } from "./Card.tsx";
import { configIsValid } from "./lib.ts";

const name = pkg.name;

class SolidCard extends HTMLElement {
	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: "open" });

		const [configStore, setConfigStore] = createStore();
		this.configStore = configStore;
		this.setConfigStore = setConfigStore;

		const [hassStore, setHassStore] = createStore();
		this.hassStore = hassStore;
		this.setHassStore = setHassStore;
	}

	connectedCallback() {
		this.dispose = render(
			() => (
				<Show when={configIsValid(this.configStore, this.hassStore)} fallback={<div>Config is invalid!</div>}>
					<Card {...this.configStore} hass={this.hassStore} />
				</Show>
			),
			this.shadow,
		);
	}

	disconnectedCallback() {
		if (this.dispose) {
			this.dispose();
		}
	}

	set hass(hass) {
		this.setHassStore(hass);
	}

	setConfig(config) {
		this.setConfigStore(config);
	}
}

// Register custom element
if (!customElements.get(name)) {
	customElements.define(name, SolidCard);
}

// Expose custom card for HA
window.customCards = window.customCards || [];
window.customCards.push({
	type: name,
	name: hacs.name,
	preview: true,
	description: pkg.description,
	documentationURL: pkg.homepage,
});

// Log custom component information to the console
console.info(
	`%c ${name} | Version ${pkg.version} `,
	"color: white; font-weight: bold; background: #FF4F00",
);
