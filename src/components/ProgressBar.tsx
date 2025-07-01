import { For } from "solid-js";
import { createStore } from "solid-js/store";

export const ProgressBar = () => {
  const [store, setStore] = createStore({
    bars: [],
  });

  const bins = 36;
  const pad = 1;

  const generate = () => {
    let width = (100 + pad) / bins - pad;
    let height = 10;

    var data = [];
    for (let i = 0; i < bins; i++) {
      let x = i * (width + pad);
      let y = 0;

      data.push({ x: x, y: y, width: width, height: height, id: i });
    }
    return data;
  };

  setStore("bars", generate());

  return (
    <svg viewBox="0 0 100 10.2">
      <title>Progress bar</title>
      <g transform="translate(0,0)">
        <For each={store.bars}>
          {(bar) => (
            <rect
              x={bar.x}
              y={bar.y}
              width={bar.width}
              height={bar.height}
              rx="1"
              fill="black"
            />
          )}
        </For>
      </g>
    </svg>
  );
};
