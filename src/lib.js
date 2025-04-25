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

const extractParts = (content) => {
  return content.split(":");
};

export const getDuration = (entityId, hass) => {
  const state = hass.states[entityId];
  const domain = getDomain(entityId);

  console.log(domain, state);

  let seconds = 0;
  let minutes = 0;
  let hours = 0;

  switch (domain) {
    case "timer":
      const parts = extractParts(state.attributes.duration);
      switch (state.state) {
        case "active":
          break;
        case "paused":
          break;
        case "idle":
          hours = parts[0];
          minutes = parts[1];
          seconds = parts[2];
          break;
      }
      break;
  }

  return {
    seconds,
    minutes,
    hours,
  };
};
