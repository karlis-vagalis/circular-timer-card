import { ScaleSequential } from "d3-scale";

type Layout = "circle" | "minimal";
type ProgressDirection = "countup" | "countdown";

type Actions = {
	tap: string;
	hold: string;
	double_tap: string;
};

export type Color = string | string[]

export type ColorScale = ScaleSequential<string>

export interface Style {
	corner_radius?: number;
	bin_padding: number;
	color?: Color;
	empty_color: string;
}

export type Config = {
	entity: string;
	layout: Layout;
	direction: ProgressDirection;
	bins: number;
	icon: string | undefined;
	style: Style;
	actions: Actions;
};

export type Duration = {
	seconds: number;
	minutes: number;
	hours: number;
};
