type Layout = "circle" | "minimal";
type ProgressDirection = "countup" | "countdown";

interface Actions {
  tap: string;
  hold: string;
  double_tap: string;
}

interface Style {
    corner_radius: number
}

export type Config = {
  entity: string;
  layout: Layout;
  progress: {
    count: number;
    direction: ProgressDirection;
  };
  style: Style;
  actions: Actions;
};
