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
    new Date(seconds * 1000).toISOString().substring(11, 16),
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

export const formatDuration = (duration) => {
  return `${pad(duration.hours)}:${pad(duration.minutes)}:${pad(duration.seconds)}`;
};

export const getRemaining = (entityId, hass) => {
  const state = hass.states[entityId];
  const domain = getDomain(entityId);

  console.log(domain, state);

  let remaining = {
    hours: 0,
    minutes: 0,
    seconds: 0,
  };
  let total = {
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  switch (domain) {
    case "timer":
      total = parseDuration(state.attributes.duration);
      switch (state.state) {
        case "active":
          remaining = toDuration(
            secondsTillFinish(state.attributes.finishes_at),
          );
          break;
        case "paused":
          remaining = parseDuration(state.attributes.remaining);
          break;
        case "idle":
          remaining = total;
          break;
      }
      break;
  }

  const progress = getProgress(remaining, total);

  return {
    progress,
    duration: remaining,
  };
};
