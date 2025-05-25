import { createEffect, mergeProps } from "solid-js";
import * as d3 from "d3";

const ProgressBar = (props) => {
  let svgRef;
  const componentProps = mergeProps(
    {
      config: {
        bins: 36,
        pad_angle: 1, // degrees
        corner_radius: 4,
        color: "#03a9f4", // Default single color
        empty_bar_color: "#00000010", // Default empty bar color
        // Other potential props like size, strokeWidth could be added here
      },
      progress: 0, // Default progress
    },
    props,
  );

  const size = 100; // SVG viewBox size
  const strokeWidth = 10; // Width of the progress bar track and fill
  const radius = (size - strokeWidth) / 2;
  const gradientId = "progressGradient";

  createEffect(() => {
    const {
      bins,
      pad_angle: padAngleDeg,
      corner_radius,
      color,
      empty_bar_color,
    } = componentProps.config;
    const progress = componentProps.progress;

    const svg = d3.select(svgRef);
    svg.selectAll("*").remove(); // Clear previous rendering

    // Define gradient if color is an array
    if (Array.isArray(color)) {
      const defs = svg.append("defs");
      const linearGradient = defs
        .append("linearGradient")
        .attr("id", gradientId)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%") // Adjust if gradient direction needs to change (e.g., along the circle)
        .attr("y2", "0%"); // For a horizontal gradient across the filled part

      linearGradient
        .selectAll("stop")
        .data(color)
        .enter()
        .append("stop")
        .attr("offset", (d, i) => `${(i / (color.length - 1)) * 100}%`)
        .attr("stop-color", (d) => d);
    }

    const g = svg
      .append("g")
      .attr("transform", `translate(${size / 2},${size / 2})`);

    if (bins === 1) {
      // Single arc logic
      const endAngle = 2 * Math.PI * progress;

      // Background/empty part (always full circle if only one bin represents the track)
      const trackArc = d3
        .arc()
        .innerRadius(radius - strokeWidth / 2)
        .outerRadius(radius + strokeWidth / 2)
        .startAngle(0)
        .endAngle(2 * Math.PI)
        .cornerRadius(corner_radius);

      g.append("path")
        .attr("d", trackArc)
        .attr("fill", empty_bar_color)
        .attr("stroke-width", strokeWidth / bins) // Thinner stroke for single bin? Or keep consistent?
        .attr("stroke", empty_bar_color);


      if (progress > 0) {
        const progressArcGenerator = d3
          .arc()
          .innerRadius(radius - strokeWidth / 2)
          .outerRadius(radius + strokeWidth / 2)
          .startAngle(0)
          .endAngle(endAngle)
          .cornerRadius(corner_radius);

        g.append("path")
          .attr("d", progressArcGenerator)
          .attr("fill", Array.isArray(color) ? `url(#${gradientId})` : color)
          .attr("stroke-width", strokeWidth / bins)
          .attr("stroke", Array.isArray(color) ? `url(#${gradientId})` : color);
      }
    } else {
      // Multi-bin logic
      const padAngleRad = padAngleDeg * (Math.PI / 180);
      const totalAngleForBins = 2 * Math.PI; // Bins will fill the whole circle
      const binAngle = (totalAngleForBins - padAngleRad * bins) / bins;
      
      if (binAngle < 0) {
        console.warn("ProgressBar: Calculated binAngle is negative. Check bins and pad_angle configuration. Reducing pad_angle to 0 for rendering.");
        padAngleRad = 0; // Reset padAngleRad if binAngle is negative
        binAngle = (totalAngleForBins / bins); // Recalculate binAngle without padding
      }

      const arcData = [];
      const activeBinsCount = Math.floor(progress * bins);

      for (let i = 0; i < bins; i++) {
        const startAngle = i * (binAngle + padAngleRad);
        const endAngle = startAngle + binAngle;
        arcData.push({
          startAngle,
          endAngle,
          type: i < activeBinsCount ? "active" : "empty",
        });
      }

      const arcGenerator = d3
        .arc()
        .innerRadius(radius - strokeWidth / 2)
        .outerRadius(radius + strokeWidth / 2)
        .cornerRadius(corner_radius);
        // padAngle on the generator is for padding *within* an arc.
        // We've already accounted for padding between arcs in start/endAngle.

      g.selectAll("path")
        .data(arcData)
        .join("path")
        .attr("d", arcGenerator)
        .attr("fill", (d) => {
          if (d.type === "active") {
            return Array.isArray(color) ? `url(#${gradientId})` : color;
          }
          return empty_bar_color;
        });
        // Removed stroke for individual bins for a cleaner look with padding
        // .attr("stroke", (d) => (d.type === "active" ? (Array.isArray(color) ? `url(#${gradientId})` : color) : empty_bar_color))
        // .attr("stroke-width", 1); // A small stroke if desired
    }
  });

  return (
    <div class="flex justify-center items-center">
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      ></svg>
    </div>
  );
};

export default ProgressBar;
