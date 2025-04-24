import pkg from '../package.json';
import { customElement } from "solid-element";
import { Card } from "./Card.jsx";

customElement("polytime-card", {}, Card);

console.info(
	`%c polytime-card | Version ${pkg.version} `,
	"color: white; font-weight: bold; background: #FF4F00",
);
