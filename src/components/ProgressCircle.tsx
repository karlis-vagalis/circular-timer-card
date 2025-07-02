/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
import { arc } from "d3-shape";
import { createEffect, For } from "solid-js";
import { createStore } from "solid-js/store";
import { toRadians } from "../lib.ts";
import type { ColorScale, Config } from "../types.ts";

function getArc(config: Config) {
	return arc()
		.innerRadius(30)
		.outerRadius(48)
		.cornerRadius(config.corner_radius)
		.padAngle(toRadians(config.bin_padding));
}

function getArcData(config: Config) {
	let arc = getArc(config);
	const bins = config.bins;
	let data = [];
	for (let i = 0; i < config.bins; i++) {
		data.push(
			arc({
				startAngle: toRadians((i * 360) / bins),
				endAngle: toRadians(((i + 1) * 360) / bins),
			}),
		);
	}
	return data;
}

export const ProgressCircle = (
	props: Config & { colorScale: ColorScale; limitBin: number },
) => {
	const [graph, setGraph] = createStore({
		arcs: [],
	});
	createEffect(() => {
		setGraph("arcs", getArcData(props));
	});

	return (
		<svg class="m-2 overflow-visible" viewBox="0 0 100 100">
			<g transform="translate(50,50)">
				<For each={graph.arcs}>
					{(arc, i) => (
						<path
							class="bin"
							d={arc}
							fill={
								i() < props.limitBin
									? props.colorScale(i() / (props.bins - 1))
									: props.empty_bin_color
							}
						/>
					)}
				</For>
			</g>
		</svg>
	);
};
