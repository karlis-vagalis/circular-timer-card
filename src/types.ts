type Layout = "circle" | "minimal";
type ProgressDirection = "countup" | "countdown";

type Actions = {
	tap: string;
	hold: string;
	double_tap: string;
};

interface Style {
	corner_radius: number;
	padding: number;
	color: string | string[];
	empty_color: string;
}

export type Config = {
	entity?: string;
	layout: Layout;
	info: {
		primary: string;
		secondary: string;
	};
	icon: string | undefined;
	progress: {
		count: number; // bins
		direction: ProgressDirection;
	};
	style: Style;
	actions: Actions;
};

export type Duration = {
	seconds: number;
	minutes: number;
	hours: number;
};
