import type { Color, ColorScale, Config, Duration } from "./types.ts";
import { scaleSequential } from "d3-scale";
import { interpolateRgbBasis } from "d3-interpolate";

const PRIMARY_TEXT_COLOR = getComputedStyle(
  document.documentElement
).getPropertyValue("--primary-text-color");
const PRIMARY_COLOR = getComputedStyle(
  document.documentElement
).getPropertyValue("--primary-color");

export const configIsValid = (config: Config, hass) => {
  const entity = config.entity;
  return typeof entity === "string" && entity in hass.states;
};

export const standardizeColor = (color?: Color): string[] => {
  if (typeof color === "string") {
    return [color, color];
  } else if (Array.isArray(color)) {
    if (color.length === 1) {
      return [color[0], color[0]];
    } else {
      return color;
    }
  } else {
    return [PRIMARY_COLOR, PRIMARY_COLOR];
  }
};

export const getColorScale = (color?: Color): ColorScale => {
  return scaleSequential(interpolateRgbBasis(standardizeColor(color)));
};

const getDomain = (entityId: string) => {
  return entityId.split(".")[0];
};

const parseDuration = (content: string): Duration => {
  const { hours, minutes, seconds } =
    /^(?<hours>[0-9]{1,2}):(?<minutes>[0-9]{1,2}):(?<seconds>[0-9]{1,2})$/gm.exec(
      content
    ).groups;
  return {
    hours: parseInt(hours),
    minutes: parseInt(minutes),
    seconds: parseInt(seconds),
  };
};

const toSeconds = (duration: Duration) => {
  return duration.seconds + duration.minutes * 60 + duration.hours * 60 * 60;
};

const toDuration = (seconds: number) => {
  return parseDuration(
    new Date(seconds * 1000).toISOString().substring(11, 19)
  );
};

const secondsTillFinish = (finishesAt: string) => {
  return (Date.parse(finishesAt) - new Date()) / 1000;
};

const getProgress = (remainingDuration: Duration, totalDuration: Duration) => {
  let total = toSeconds(totalDuration);
  if (total === 0) total++;
  return toSeconds(remainingDuration) / total;
};

const pad = (number: number) => {
  return String(number).padStart(2, "0");
};

export const toRadians = (degrees: number) => degrees * (Math.PI / 180);

export const formatDuration = (duration: Duration) => {
  return `${pad(duration.hours)}:${pad(duration.minutes)}:${pad(
    duration.seconds
  )}`;
};

export const getRemaining = (entityId: string, hass) => {
  const state = hass.states[entityId];
  const domain = getDomain(entityId);

  //console.log(domain, state);

  let remaining: Duration = {
    hours: 0,
    minutes: 0,
    seconds: 0,
  };
  let total: Duration = {
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
            secondsTillFinish(state.attributes.finishes_at)
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
