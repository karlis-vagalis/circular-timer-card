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
import { entityExistsAndIsValid, getRemaining } from "./lib.js";
import { createStore } from "solid-js/store";
import { DurationString } from "./components/DurationString.jsx";
import { ProgressBar } from "./components/ProgressBar.jsx";
import { MinimalProgressBar } from "./components/MinimalProgressBar.jsx";
import TimerControls from "./components/TimerControls.jsx"; // Added TimerControls

export const Card = (props) => {
  // Default props
  const defaultProps = {
    config: {
      layout: "circle",
      name: null, // Default to entity friendly_name
      icon: null, // Default to entity icon
      primary_info: "name",
      secondary_info: "timer",
      color_state: false,
      direction: "countdown",
      tap_action: "toggle",
      hold_action: "more_info",
      double_tap_action: "cancel",
      // secondary_info_size is handled by a memo
      // color is handled by ProgressBar's defaults or direct use
      progress: {},
    },
    hass: {}, // Ensure hass is available
  };
  props = mergeProps(defaultProps, props);

  const [remaining, setRemaining] = createStore({
    progress: 0,
    duration: {
      seconds: 0,
      minutes: 0,
      hours: 0,
    },
  });
  const [entity, setEntity] = createSignal();

  createEffect(() => {
    const entityId = props.config?.entity;
    setEntity(
      entityExistsAndIsValid(props.config, props.hass) ? entityId : undefined,
    );
  });

  createEffect(() => {
    if (entity() && props.hass && props.hass.states) {
      // Pass props.config to getRemaining
      setRemaining(getRemaining(entity(), props.hass, props.config));
    }
  });
  
  const displayEntity = () => entity() && props.hass?.states?.[entity()];
  const entityName = () => displayEntity()?.attributes?.friendly_name;
  const entityIcon = () => displayEntity()?.attributes?.icon;

  const configName = () => props.config.name;
  const configIcon = () => props.config.icon;

  const displayName = () => {
    if (configName() === "none") return null;
    return typeof configName() === "string" ? configName() : entityName();
  };

  const displayIconValue = () => {
    if (configIcon() === "none") return null;
    return typeof configIcon() === "string" ? configIcon() : entityIcon();
  };
  
  const currentTimerTextColor = () => {
    if (!props.config.color_state) return undefined;
    const colorSetting = props.config.color; // ProgressBar handles its own color default
    if (Array.isArray(colorSetting)) {
      return colorSetting.length > 0 ? colorSetting[colorSetting.length - 1] : undefined;
    }
    return typeof colorSetting === 'string' ? colorSetting : undefined;
  };

  const currentSecondaryInfoSizeStyle = () => {
    const size = props.config.secondary_info_size;
    if (size) return `font-size: ${typeof size === 'number' ? `${size}px` : size};`; // Allow number for px
    return props.config.layout === "minimal" ? "font-size: 80%;" : "font-size: 50%;";
  };

  const RenderInfoSlot = (slotProps) => {
    const content = () => {
      switch (slotProps.type) {
        case "name":
          return slotProps.nameToDisplay && <div>{slotProps.nameToDisplay}</div>;
        case "timer":
          return <DurationString duration={slotProps.durationData} textColor={slotProps.textColor} />;
        case "none":
          return null;
        default:
          return null;
      }
    };
    return <div style={slotProps.style}>{content()}</div>;
  };

  // Determine if timer is running
  const isRunning = () => displayEntity()?.state === "active";
  const isPaused = () => displayEntity()?.state === "paused";
  const isIdle = () => displayEntity()?.state === "idle";

  let cardRef; // Ref for the ha-card element
  let tapTimeoutId = null;
  let holdTimeoutId = null;
  let lastTapTimestamp = 0;
  let isPointerCurrentlyDown = false; // To track if pointer is still down for hold
  const DOUBLE_TAP_THRESHOLD = 300; // ms
  const HOLD_THRESHOLD = 700; // ms

  const fireEventHelper = (node, type, detail = {}, options = {}) => {
    const event = new Event(type, {
      bubbles: options.bubbles === undefined ? true : options.bubbles,
      cancelable: Boolean(options.cancelable),
      composed: options.composed === undefined ? true : options.composed,
    });
    event.detail = detail;
    node.dispatchEvent(event);
    return event;
  };
  
  const executeAction = (actionName) => {
    if (!entity() || !props.hass || !props.hass.callService) return;

    const currentEntityId = entity();
    const currentEntityState = displayEntity()?.state;

    switch (actionName) {
      case "toggle":
        if (currentEntityState === "active") {
          props.hass.callService("timer", "pause", { entity_id: currentEntityId });
        } else { // paused or idle
          props.hass.callService("timer", "start", { entity_id: currentEntityId });
        }
        break;
      case "more_info":
        if (cardRef) {
          fireEventHelper(cardRef, "hass-more-info", { entityId: currentEntityId });
        }
        break;
      case "cancel":
        props.hass.callService("timer", "cancel", { entity_id: currentEntityId });
        break;
      case "none":
      default:
        // Do nothing
        break;
    }
  };

  const handlePointerDown = (event) => {
    // event.button === 0 ensures only primary (left) click/tap
    if (event.button !== 0 && event.pointerType !== 'touch') return;

    isPointerCurrentlyDown = true;
    clearTimeout(holdTimeoutId); // Clear any existing hold timer

    holdTimeoutId = setTimeout(() => {
      if (isPointerCurrentlyDown) { // Check if pointer is still down
        executeAction(props.config.hold_action);
        lastTapTimestamp = 0; // Prevent tap/double_tap after hold
        clearTimeout(tapTimeoutId); // Clear pending tap
        isPointerCurrentlyDown = false; // Mark hold as handled
      }
    }, HOLD_THRESHOLD);
  };

  const handlePointerUp = (event) => {
    if (event.button !== 0 && event.pointerType !== 'touch') return;

    clearTimeout(holdTimeoutId); // Clear hold timer

    if (!isPointerCurrentlyDown) { // If false, means hold action already executed or pointer left
        return;
    }
    isPointerCurrentlyDown = false; // Pointer is up

    const currentTime = new Date().getTime();
    if (currentTime - lastTapTimestamp < DOUBLE_TAP_THRESHOLD) {
      // Double tap
      clearTimeout(tapTimeoutId); // Cancel single tap timeout
      executeAction(props.config.double_tap_action);
      lastTapTimestamp = 0; // Reset for next double tap detection
    } else {
      // Potential single tap
      lastTapTimestamp = currentTime;
      clearTimeout(tapTimeoutId); // Clear previous if any
      tapTimeoutId = setTimeout(() => {
        executeAction(props.config.tap_action);
        lastTapTimestamp = 0; // Reset after action
      }, DOUBLE_TAP_THRESHOLD + 50); // Wait a bit longer than threshold to ensure it's not a double tap
    }
  };
  
  const handlePointerLeave = (event) => {
    if (isPointerCurrentlyDown) {
      clearTimeout(holdTimeoutId);
      clearTimeout(tapTimeoutId);
      isPointerCurrentlyDown = false;
      // lastTapTimestamp = 0; // Optionally reset tap sequence
    }
  };

  return (
    <>
      <style>{style}</style>
      <ha-card 
        ref={cardRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave} // Handle cases where pointer leaves element while pressed
        classList={{ "bg-red-900": !entity() }}
        tabIndex="0" // Make it focusable for accessibility, though keyboard interaction needs separate thought
      >
        {/* Warning for missing/invalid entity */}
        <Show when={!entity()}>
          <Warning message="Card configuration does not contain 'entity' setting or the provided ID is invalid!" />
        </Show>

        <Show when={entity()}>
          {/* Removed wrapper div class="card-content", actions are on ha-card directly */}
          {/* Icon (primarily for minimal layout) */}
          <Show when={displayIconValue() && props.config.layout === 'minimal'}>
            <ha-icon icon={displayIconValue()} class="entity-icon" />
            </Show>

            <div class="info-container"> {/* This div might need pointer-events: none if it interferes */}
              {/* Primary Info */}
              <RenderInfoSlot
                type={props.config.primary_info}
                nameToDisplay={displayName()}
                durationData={remaining.duration}
                textColor={props.config.primary_info === 'timer' ? currentTimerTextColor() : undefined}
              />

              {/* Secondary Info */}
              <RenderInfoSlot
                type={props.config.secondary_info}
                nameToDisplay={displayName()}
                durationData={remaining.duration}
                textColor={props.config.secondary_info === 'timer' ? currentTimerTextColor() : undefined}
                style={currentSecondaryInfoSizeStyle()}
              />
            </div>
            
            <Switch fallback={<ProgressBar progress={remaining.progress} config={props.config} hass={props.hass} />}>
              <Match when={props.config.layout === "circle"}>
                <ProgressBar progress={remaining.progress} config={props.config} hass={props.hass} />
              </Match>
              <Match when={props.config.layout === "minimal"}>
                <MinimalProgressBar progress={remaining.progress} config={props.config} hass={props.hass} />
              </Match>
            </Switch>
          {/* Timer Controls - Placed outside card-content to avoid click propagation issues if any */}
          {/* If TimerControls should NOT trigger card actions, it needs to stop event propagation */}
          <TimerControls 
            hass={props.hass} 
            entity={entity()} 
            isRunning={isRunning()}
            onPointerDown={(e) => e.stopPropagation()} // Prevent card actions when controls are used
            onClick={(e) => e.stopPropagation()} // Also for click
          />
        </Show>
      </ha-card>
    </>
  );
};
