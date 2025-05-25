import { createEffect, mergeProps } from "solid-js";

export const MinimalProgressBar = (props) => {
  props = mergeProps(
    {
      progress: 0,
      config: {
        color: '#03a9f4', // Default progress color
        empty_bar_color: '#00000010' // Default background color
      }
    },
    props
  );

  // Simple SVG bar
  const barHeight = 10;
  const barWidth = () => props.progress * 100; // Assuming progress is 0-1

  const currentProgressColor = () => {
    if (Array.isArray(props.config.color)) {
      return props.config.color.length > 0 ? props.config.color[0] : '#03a9f4'; // Fallback if array is empty
    }
    return props.config.color;
  };

  const currentEmptyBarColor = () => props.config.empty_bar_color;

  return (
    <svg viewBox={`0 0 100 ${barHeight}`} width="100%" height={barHeight}>
      <rect x="0" y="0" width="100" height={barHeight} fill={currentEmptyBarColor()} /> {/* Background */}
      <rect x="0" y="0" width={barWidth()} height={barHeight} fill={currentProgressColor()} /> {/* Progress */}
    </svg>
  );
};
