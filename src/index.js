import { customElement } from "solid-element";
import { Card } from "./Card.jsx";

customElement("circular-timer-card", {}, Card);

console.info(
	`%c circular-timer-card | Version 1.1 `,
	"color: white; font-weight: bold; background: #FF4F00",
);
