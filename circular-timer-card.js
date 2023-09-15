import { html, svg, css, LitElement } from "https://unpkg.com/lit?module";
import { repeat } from 'https://unpkg.com/lit/directives/repeat.js?module';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

class CircularTimerCard extends LitElement {

  constructor() {
    super();

    // Defaults
    this._bins = 36;
    this._padAngle = 1;
    this._cornerRadius = 4;
    this._defaultTimerFill = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
    this._gradientColors = [this._defaultTimerFill, this._defaultTimerFill];
    this._defaultTimerEmptyFill = "#fdfdfd00";
    this._secondaryInfoSize = "50%";

    this._colorState = false;
    this._stateColor = getComputedStyle(document.documentElement).getPropertyValue("--primary-text-color");

    // To update card every half second
    this._timeUpdater = 1;
    setInterval(() => {this._timeUpdater++;}, 500);

    // Event listener bindings (https://developers.home-assistant.io/blog/2023/07/07/action-event-custom-cards/)

    this.addEventListener("click", this._tap);

    this._mouseIsDown = false;
    this.addEventListener("mousedown", this._mousedown);
    this.addEventListener("touchstart", this._mousedown);
    this.addEventListener("mouseup", this._mouseup);
    this.addEventListener("touchend", this._mouseup);

    this.addEventListener("dblclick", this._double_tap);

    ////
  }
  
  static get properties() {
    return {
      _config: {},
      _timeUpdater: {}
    };
  }

  setConfig(config) {

    if (!config.entity) {
      throw new Error("You need to provide entity!");
    }

    var domain = config.entity.split(".")[0];
    if (domain !== "timer") {
      throw new Error("Provided entity is not a timer!");
    }

    // Define the action config
    this._actionConfig = {
      entity: config.entity,
      hold_action: {
        action: "more-info",
        start_listening: true,
      }
    };

    if (config.bins) {
      this._bins = config.bins;
    }
    this._seqmentSize = 360 / this._bins;

    if (config.pad_angle) {
      this._padAngle = config.pad_angle;
    }

    if (config.corner_radius) {
      this._cornerRadius = config.corner_radius;
    }

    if (config.color) {
      if (config.color.length === 1) {
        this._gradientColors = [config.color[0], config.color[0]];
      } else {
        this._gradientColors = config.color;
      }
    }

    if (config.color_state) {
      this._colorState = config.color_state;
    }

    if (config.empty_bar_color) {
      this._defaultTimerEmptyFill = config.empty_bar_color;
    }

    if (config.secondary_info_size) {
      this._secondaryInfoSize = config.secondary_info_size;
    }

    this._colorScale = d3.scaleSequential(d3.interpolateRgbBasis(this._gradientColors));
    this._arc = d3.arc()
      .innerRadius(30)
      .outerRadius(48)
      .startAngle( (d)  => { return this._toRadians(d.start); })
      .endAngle( (d)  => { return this._toRadians(d.end); })
      .cornerRadius(this._cornerRadius)
      .padAngle(this._toRadians(this._padAngle));

    this._arcData = this._generateArcData();

    this._config = config;
  }

  render() {

    if (!this.hass || !this._config) {
      return html``;
    }

    this._stateObj = this.hass.states[this._config.entity];
    if (!this._stateObj) {
      return html` <ha-card>Unknown entity: ${this._config.entity}</ha-card> `;
    }

    var a = this._stateObj.attributes.duration.split(':');
    var d_sec = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    var rem_sec;
    if (this._stateObj.state == "active") {
      rem_sec = ((Date.parse(this._stateObj.attributes.finishes_at) - new Date()) / 1000);
    } else {
      if (this._stateObj.state == "paused") {
        var a1 = this._stateObj.attributes.remaining.split(':');
        rem_sec = (+a1[0]) * 60 * 60 + (+a1[1]) * 60 + (+a1[2]);
      } else {
        rem_sec = d_sec;
      }
    }
    var proc = rem_sec / d_sec;
    

    var limitBin = Math.floor(this._bins * proc);
    var colorData = this._generateArcColorData(limitBin);
    var textColor = this._getTextColor(proc);
    
    return html`
      <ha-card>
        <svg viewBox="0 0 100 100">
          <g transform="translate(50,50)" data="test">
            ${repeat(
              this._arcData,
              (d) => d.id,
              (d, index) => svg`<path class="arc" d=${d.arc} fill=${colorData[index]} />`
            )}
          </g>
          <g transform="translate(50,50)">
            <text id="countdown" text-anchor="middle" dominant-baseline="central" fill=${textColor}>${this._getTimeString(rem_sec)}</text>
          </g>
          <g transform="translate(50,62)">
            <text id="timer-name" text-anchor="middle" dominant-baseline="central" fill="var(--secondary-text-color)" style="font-size:${this._secondaryInfoSize};">${this._stateObj.attributes.friendly_name}</text>
          </g>
        </svg>
      </ha-card>
    `;
  }

  _generateArcData() {
    var data = [];
    for (var i = 0; i < this._bins; i++){
      data.push({arc: this._arc({start: i*this._seqmentSize, end: (i+1) * this._seqmentSize}), id: i});
    }
    return data;
  }

  _generateArcColorData(limitBin) {
    var data = [];
    for (var i = 0; i < this._bins; i++){
      var color;
      if (i < limitBin) {
        color = this._colorScale(i/(this._bins-1));
      } else {
        color = this._defaultTimerEmptyFill;
      }
  
      data.push(color);
    }
    return data;
  }

  _getTextColor(proc) {
    if (this._colorState) {
      return this._colorScale(proc);
    } else {
      return this._stateColor;
    }
  }

  _toRadians(deg) {
    return deg * (Math.PI / 180);
  }

  _getTimeString(s) {

    var h = Math.floor(s / 3600);
    var m = Math.floor(s % 3600 / 60);
    var s = Math.floor(s % 3600 % 60);

    var hours = h.toString().padStart(2, '0');
    var minutes = m.toString().padStart(2, '0');
    var seconds = s.toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`
  }

  _tap(e) {

    const stateObj = this.hass.states[this._config.entity];
    const service = stateObj.state === "active" ? "pause" : "start";
  
    this.hass.callService("timer", service, { entity_id: this._config.entity });
  }

  _double_tap(e) {

    const stateObj = this.hass.states[this._config.entity];
    this.hass.callService("timer", "cancel", { entity_id: this._config.entity });

  }

  _mousedown(e) {

    this._mouseIsDown = true;
    setTimeout(() => {

      if(this._mouseIsDown) {
        var event = new Event("hass-action", {
          bubbles: true,
          composed: true,
        });
        event.detail = {
          config: this._actionConfig,
          action: "hold",
        };
        this.dispatchEvent(event);
      }
    }, 1000);
  }

  _mouseup(e) {
    this._mouseIsDown = false;
  }

  static get styles() {

    return css`
      svg {
        margin: 5px;
      }
      path:hover {
        opacity: 0.85;
      }
      #countdown {
        font-weight: 600;
        font-size: 85%;
      }
      #timer-name {
        font-weight: 600;

        text-transform: capitalize;
      }
    `;
  }
}

customElements.define("circular-timer-card", CircularTimerCard);
