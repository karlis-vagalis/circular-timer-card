export const entityExistsAndIsValid = (config, hass) => {
  const id = config?.entity;
  return (
    Object.hasOwn(config, "entity") &&
    typeof id === "string" &&
    id in hass.states
  );
};
