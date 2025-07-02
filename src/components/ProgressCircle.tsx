import { arc } from "d3-shape";
import { createEffect, For } from "solid-js";
import { createStore } from "solid-js/store";
import { toRadians } from "../lib.ts";
import type { Config } from "../types.ts";

function getArc(config: Config) {
	return arc()
		.innerRadius(30)
		.outerRadius(48)
		.cornerRadius(config.style.corner_radius)
		.padAngle(toRadians(config.style.bin_padding));
}

function getArcData(config: Config) {
	let arc = getArc(config);
	const bins = config.progress.bins;
	let data = [];
	for (let i = 0; i < config.progress.bins; i++) {
		data.push(
			arc({
				startAngle: toRadians((i * 360) / bins),
				endAngle: toRadians(((i + 1) * 360) / bins),
			}),
		);
	}
	return data;
}

export const ProgressCircle = (props: Config) => {
	const [arcs, setArcs] = createStore({
		data: [],
	});
	createEffect(() => {
		setArcs("data", getArcData(props));
	});
	return (
		<svg viewBox="0 0 100 100">
			<title>Progress Circle</title>
			<g transform="translate(50,50)">
				<For each={arcs.data}>
					{(arc) => <path class="arc" d={arc} fill="yellow" />}
				</For>
			</g>
		</svg>
	);
};
