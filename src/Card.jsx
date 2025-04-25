import {
  createSignal,
  createEffect,
  mergeProps,
  Show,
  Match,
  Switch,
} from "solid-js";
import style from "./Card.css";
import { Warning } from "./components/Warning.jsx";
import { entityExistsAndIsValid, getDuration } from "./lib.js";
import { createStore } from "solid-js/store";

export const Card = (props) => {
  props = mergeProps(
    {
      config: {
        style: "circle",
        progress: {
          count: 1,
        },
      },
    },
    props,
  );
  const [duration, setDuration] = createStore({
    seconds: 0,
    minutes: 0,
    hours: 0,
  });
  const [entity, setEntity] = createSignal();

  createEffect(() => {
    const entityId = props.config?.entity;
    setEntity(
      entityExistsAndIsValid(props.config, props.hass) ? entityId : undefined,
    );
  });

  createEffect(() => {
    const d = getDuration(entity(), props.hass);
    setDuration(d);
  });

  return (
    <>
      <style>{style}</style>
      <ha-card classList={{ "bg-red-900": !entity() }}>
        <Show when={!entity()}>
          <Warning message="Card configuration does not contain 'entity' setting or the provided ID is invalid!" />
        </Show>
        <Switch>
          <Match when={props.config.style === "circle"}></Match>
        </Switch>
        <Show when={entity()}>
          {duration.hours}:{duration.minutes}:{duration.seconds}
        </Show>
      </ha-card>
    </>
  );
};
