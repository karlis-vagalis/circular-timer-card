[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)

## Description

This custom lovelace card is ment to display timers and their countdowns in a circular arc plot using D3.js.

## Installation

### Manually
1. Run `npm install` and `npx rollup -c` to merge source file with libs
2. Download `circular-timer-card.js` as save to your desired destination
3. Add `circular-timer-card.js` to your Lovelace resources as a Javascript module

### HACS
This custom card has been submitted to be added to HACS repository, as soon at is will be available, this section will be updated!

## Actions

### Tap

Tap action will toggle the timer

### Hold

Hold (>1 sec) action will open more-info dialog for the timer

### Double-tap

Double tap will cancel (reset) timer

## Screenshots

![Sample screenshot](/images/circular-timer.gif)
![Sample screenshot](/images/screenshot1.png)
![Sample screenshot](/images/screenshot3.png)
![Sample screenshot](/images/circular-timer-minimal.gif)


## Available options

All following options which support colors can also be used with hexadecimal color identifier with opacity!

| Option | Type | Requirement | Default | Description |
|---|---|---|---|---|
| entity | string | **required** | - | Timer entity ID |
| bins | int | optional | 36 | Number of bins (arcs). |
| pad_angle | float | optional | 1 | Seperating angle between each individual arc in degrees. |
| corner_radius | float | optional | 4 | Radius for rounded arc corners. |
| color | array of strings | optional | | Color array used for filling remaining timer arc units. If array contains only single value, that color will be used to fill the whole timer, otherwise linear gradient will be created. |
| color_state | boolean | optional | | If set to `true` it will color remaining time in the middle of card with current state color from gradient. |
| empty_bar_color | string | optional | | Color for timer arcs which are inactive, by default they gave opacity of 0, therefore they are not visible. |
| secondary_info_size | string or int | optional | 50% for cicle or 80% for minimal | CSS size for secondary info (Friendly name of timer). |
| layout | string | optional | circle | Layout mode for the card. Available options are "circle" or "minimal". Minimal layout is supposed to create bar timer similar in style to Mushroom cards. |
| name | string | optional | Entity friendly name | Name to be displayed. Can be a string or "none". |
| icon | string | optional | Etity Icon | Icon to be displayed in minimal layout. Can be a standard icon (e.g. "mdi:motion-sensor") or "none". |
| direction | string | optional | countdown | Direction of the timer. Can be "countdown" or "countup". |
| primary_info | string | optional | name | Primary information to be displayed. Can be a "none", "name" or "timer". |
| secondary_info | string | optional | timer | Secondary information to be displayed. Can be a "none", "name" or "timer". |
| tap_action | string | optional | toggle | Action triggered on a single tap. Can be a "none", "toggle", "more_info" or "cancel". |
| hold_action | string | optional | more_info | Action triggered on holding. Can be a "none", "toggle", "more_info" or "cancel". |
| double_tap_action | string | optional | cancel | Action triggered on a double tap. Can be a "none", "toggle", "more_info" or "cancel". |

## Example

```yaml
type: custom:circular-timer-card
entity: timer.single
bins: 60
color:
  - '#1e7883'
  - '#a9bdbb'
  - '#ee7256'
```

With minimal layout instead of circle:
```yaml
type: custom:circular-timer-card
entity: timer.minute
bins: 30
color:
  - '#1e7883'
  - '#a9bdbb'
  - '#ee7256'
layout: minimal
color_state: true
```
