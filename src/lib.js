export const entityExistsAndIsValid = (config, hass) => {
  const id = config?.entity;
  return (
    Object.hasOwn(config, "entity") &&
    typeof id === "string" &&
    id in hass.states
  );
};

const getDomain = (entityId) => {
  return entityId.split(".")[0];
};

const parseDuration = (content) => {
  const { hours, minutes, seconds } =
    /^(?<hours>[0-9]{1,2}):(?<minutes>[0-9]{1,2}):(?<seconds>[0-9]{1,2})$/gm.exec(
      content,
    ).groups;
  return {
    hours: parseInt(hours),
    minutes: parseInt(minutes),
    seconds: parseInt(seconds),
  };
};

const toSeconds = (duration) => {
  return duration.seconds + duration.minutes * 60 + duration.hours * 60 * 60;
};

const toDuration = (seconds) => {
  return parseDuration(
    new Date(seconds * 1000).toISOString().substring(11, 19),
  );
};

const secondsTillFinish = (finishesAt) => {
  return (Date.parse(finishesAt) - new Date()) / 1000;
};

const getProgress = (remainingDuration, totalDuration) => {
  let total = toSeconds(totalDuration);
  if (total === 0) total++;
  return toSeconds(remainingDuration) / total;
};

const pad = (number) => {
  return String(number).padStart(2, "0");
};

export const toRadians = (degrees) => degrees * (Math.PI / 180);

export const formatDuration = (duration) => {
  return `${pad(duration.hours)}:${pad(duration.minutes)}:${pad(duration.seconds)}`;
};

export const getRemaining = (entityId, hass, config) => {
  const state = hass.states[entityId];
  const domain = getDomain(entityId);
  const direction = config?.direction || 'countdown'; // Get direction

  let displayedDuration = { hours: 0, minutes: 0, seconds: 0 };
  let progress = 0;
  let totalDuration = { hours: 0, minutes: 0, seconds: 0 };

  switch (domain) {
    case "timer":
      totalDuration = parseDuration(state.attributes.duration);
      const totalSeconds = toSeconds(totalDuration);

      switch (state.state) {
        case "active":
          const sTillFinish = Math.max(0, secondsTillFinish(state.attributes.finishes_at));
          if (direction === "countdown") {
            displayedDuration = toDuration(sTillFinish);
            progress = totalSeconds > 0 ? sTillFinish / totalSeconds : 0;
          } else { // countup
            const elapsedSeconds = Math.max(0, totalSeconds - sTillFinish);
            displayedDuration = toDuration(elapsedSeconds);
            progress = totalSeconds > 0 ? elapsedSeconds / totalSeconds : 0;
          }
          break;
        case "paused":
          const remainingPausedSeconds = toSeconds(parseDuration(state.attributes.remaining));
          if (direction === "countdown") {
            displayedDuration = toDuration(remainingPausedSeconds);
            progress = totalSeconds > 0 ? remainingPausedSeconds / totalSeconds : 0;
          } else { // countup
            const elapsedSeconds = Math.max(0, totalSeconds - remainingPausedSeconds);
            displayedDuration = toDuration(elapsedSeconds);
            progress = totalSeconds > 0 ? elapsedSeconds / totalSeconds : 0;
          }
          break;
        case "idle":
          if (direction === "countdown") {
            displayedDuration = totalDuration;
            progress = 1; // Full, ready to start
          } else { // countup
            displayedDuration = toDuration(0); // Reset to zero
            progress = 0; // Empty, ready to start
          }
          break;
      }
      break;
    // Potentially handle other domains if necessary
  }

  return {
    progress, // This value should directly drive the visual fill of the progress bar
    duration: displayedDuration, // This value is for the text display
  };
};
