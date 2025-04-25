import { createSignal, createEffect, Show } from "solid-js";
import style from "./Card.css";
import { Warning } from "./components/Warning.jsx";
import { entityExistsAndIsValid } from "./lib.js";

export const Card = (props) => {
  const [entity, setEntity] = createSignal();

  createEffect(() => {
    const entityId = props.config?.entity;
    setEntity(
      entityExistsAndIsValid(props.config, props.hass) ? entityId : undefined,
    );
  });

  return (
    <>
      <style>{style}</style>
      <ha-card classList={{ "bg-red-900": !entity() }}>
        <Show when={!entity()}>
          <Warning message="Card configuration does not contain 'entity' setting or the provided ID is invalid!" />
        </Show>
        Entity: {entity()}
      </ha-card>
    </>
  );
};
