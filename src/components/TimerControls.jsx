import { Show } from "solid-js";

// It's good practice to define default props or ensure props are checked,
// though the <Show> wrapper handles undefined props.entity/props.hass.
const TimerControls = (props) => {
  // entityId and state are derived signals based on props.entity
  const entityId = () => props.entity?.entity_id;
  const state = () => props.entity?.state;

  const handlePlayPause = (e) => {
    e.stopPropagation(); // Prevent card-level actions
    if (!entityId() || !props.hass || !props.hass.callService) return;

    const serviceToCall = state() === "active" ? "pause" : "start";
    props.hass.callService("timer", serviceToCall, { entity_id: entityId() });
  };

  const handleCancel = (e) => {
    e.stopPropagation(); // Prevent card-level actions
    if (!entityId() || !props.hass || !props.hass.callService) return;

    props.hass.callService("timer", "cancel", { entity_id: entityId() });
  };

  // Props passed to TimerControls in Card.jsx also include onPointerDown and onClick
  // to stop propagation for card-level actions. These are passed down automatically.
  // We just need to ensure the local onClick handlers also stop propagation.
  return (
    <Show when={props.entity && props.hass}>
      <div 
        style={{ display: 'flex', 'justify-content': 'center', gap: '8px', 'margin-top': '8px' }}
        // Stop propagation for pointer events on the div wrapper as well,
        // in case the ha-icon-button doesn't cover the whole area or if there are issues.
        onPointerDown={(e) => e.stopPropagation()}
      >
        <ha-icon-button onClick={handlePlayPause} title={state() === "active" ? "Pause Timer" : "Start Timer"}>
          <ha-icon icon={state() === "active" ? "mdi:pause" : "mdi:play"} />
        </ha-icon-button>
        <ha-icon-button onClick={handleCancel} title="Cancel Timer">
          <ha-icon icon="mdi:stop" />
        </ha-icon-button>
      </div>
    </Show>
  );
};

export default TimerControls;
