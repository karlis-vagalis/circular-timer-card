[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)

## Description

This custom lovelace card is ment to display timers and their countdowns in a circular arc plot using D3.js. Unfortunately, the required D3.js and Lit modules are all imported via CDN, which is not optimal from performance point of view. I am working on it, to distribute it more effieciently in the future.

This is also my first Lovelace custom card for public, so if you have anything to recommend, please do!

## Screenshots

![Sample screenshot](/images/screenshot1.png)

## Available options

| Option | Type | Requirement | Description |
|---|---|---|---|
| entity | string | **required** | Timer entity ID |
| bins | int | optional | Number of bins (arcs). Default: 36 |
| pad_angle | float | optional | Seperating angle between each individual arc in degrees. Default: 1 |
| corner_radius | float | optional | Radius for rounded arc corners. Default: 4 |
| color | array of strings | optional | Color array used for filling remaining timer arc units. Array contains only single value, that will be used to fill timer, otherwise linear gradient vill be created |
| color_state | boolean | optional | If set to `true` it will color remaining time in the middle of card with current state color from gradient |
| empty_bar_color | string | optional | Color for timer arcs which are inactive, by default they gave opacity of 0, therefore they are not visible |
| secondary_info_size | string or int | optional | CSS size for secondary info (Friendly name of timer) |

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
