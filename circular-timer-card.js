import { html, css, LitElement } from "https://unpkg.com/lit?module";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

class CircularTimerCard extends LitElement {

  constructor() {
    super();

    // Defaults
    this._bins = 36;
    this._padAngle = 1;
    this._cornerRadius = 1;
    this._defaultTimerFill = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
    this._gradientColors = [this._defaultTimerFill, this._defaultTimerFill];
    this._defaultTimerEmptyFill = "#fdfdfd00";
    this._secondaryInfoSize = "50%";

    this._colorState = false;
    this._stateColor = getComputedStyle(document.documentElement).getPropertyValue("--primary-text-color");

    // To update card every half second
    this._timeUpdater = 1;
    setInterval(() => {this._timeUpdater++;}, 500);

    ///////////////////////
  }
  
  // This will make parts of the card rerender when this.hass or this._config is changed.
  // this.hass is updated by Home Assistant whenever anything happens in your system.
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

    this._config = config;
  }

  // The render() function of a LitElement returns the HTML of your card, and any time one or the
  // properties defined above are updated, the correct parts of the rendered html are magically
  // replaced with the new values.  Check https://lit.dev for more info.
  render() {

    if (!this.hass || !this._config) {
      return html``;
    }

    const stateObj = this.hass.states[this._config.entity];
    if (!stateObj) {
      return html` <ha-card>Unknown entity: ${this._config.entity}</ha-card> `;
    }

    if (this._config.bins) {
      this._bins = this._config.bins;
    }

    if (this._config.pad_angle) {
      this._padAngle = this._config.pad_angle;
    }

    if (this._config.corner_radius) {
      this._cornerRadius = this._config.corner_radius;
    }

    if (this._config.color) {
      if (this._config.color.length === 1) {
        this._gradientColors = [this._config.color[0], this._config.color[0]];
      } else {
        this._gradientColors = this._config.color;
      }
    }

    if (this._config.color_state) {
      this._colorState = this._config.color_state;
    }

    if (this._config.empty_bar_color) {
      this._defaultTimerEmptyFill = this._config.empty_bar_color;
    }

    if (this._config.secondary_info_size) {
      this._secondaryInfoSize = this._config.secondary_info_size;
    }

    ///////////////////


    var colorScale = d3.scaleSequential(d3.interpolateRgbBasis(this._gradientColors));


    
    var a = stateObj.attributes.duration.split(':');
    var d_sec = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    var rem_sec;
    if (stateObj.state == "active") {
      rem_sec = ((Date.parse(stateObj.attributes.finishes_at) - new Date()) / 1000);
    } else {
      if (stateObj.state == "paused") {
        var a1 = stateObj.attributes.remaining.split(':');
        rem_sec = (+a1[0]) * 60 * 60 + (+a1[1]) * 60 + (+a1[2]);
      } else {
        rem_sec = d_sec;
      }
    }
    var proc = rem_sec / d_sec;
    


    
    
    

    
    


    var data = [];
    var segmentSize = 360 / this._bins;

    var limitBin = Math.floor(this._bins * proc);

    for (var i = 0; i < this._bins; i++){

      var color;

      if (i < limitBin) {
        color = colorScale(i/(this._bins-1));
      } else {
        color = this._defaultTimerEmptyFill;
      }

      data.push({start: i*segmentSize, end: (i+1) * segmentSize, color: color});
    }

    const arc = d3.arc()
      .innerRadius(30)
      .outerRadius(48)
      .startAngle( (d)  => { return this._toRadians(d.start); })
      .endAngle( (d)  => { return this._toRadians(d.end); })
      .cornerRadius(this._cornerRadius)
      .padAngle(this._toRadians(this._padAngle));




    // Create svg element
    var svg = d3.create("svg")
      .attr("viewBox", "0 0 100 100");
      
    svg
      .append("g")
      .attr("transform", "translate(50,50)")

      .selectAll("g")
      .data(data)
      .enter()

      .append("path")
      .attr("class", "arc")
      .attr("fill", (d) => d.color)
      .attr("d", arc);
    
    svg
      .append("g")
      .attr("transform", "translate(50,50)")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .style("fill", () => {
        if (this._colorState) {
          return colorScale(proc);
        } else {
          return this._stateColor;
        }
        
      })
      .style("font-weight", 600)
      .style("font-size", "85%")
      .text(this._getTimeString(rem_sec));

    svg
      .append("g")
      .attr("transform", "translate(50,65)")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      //.style("fill", colorScale(proc))
      .style("fill", "var(--secondary-text-color)")
      .style("font-weight", 600)
      .style("font-size", this._secondaryInfoSize)
      .style("text-transform", "capitalize")
      .text(stateObj.attributes.friendly_name);
    

    return html`
      <ha-card @click=${this._tapAction}>
        ${svg.node()}
      </ha-card>
    `;
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

  _tapAction() {
    const stateObj = this.hass.states[this._config.entity];
    const service = stateObj.state === "active" ? "pause" : "start";

    this.hass.callService("timer", service, { entity_id: this._config.entity });
  }

  static get styles() {
    return css`
      svg {
        margin: 5px;
      }
    `;
  }
}

customElements.define("circular-timer-card", CircularTimerCard);
