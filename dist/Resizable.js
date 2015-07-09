/**
 * Resizable div widget
 *
 * Takes in a percent and displays a div that is that percent of its parent.
 * Allows the user to resize the the div by dragging on the right side.
 *
 * Pass in children elements to control what is displayed in the resizable.
 *
 * Under the hood there is an invisible div on the right side of the widget which handles
 * the mousedown event to start the dragging.  Once dragging starts, an overlay appears across
 * the entire page and watches for any mousemove events which triggers the onChange callback
 * with the new percent.  To visibly see what is happening, add slightly transparent
 * backgrounds to the overlay and handle css.
 *
 * Note: this widget does not actually do the resizing itself, it
 * simply calls the onChange handle with what it would expect the
 * new percent to be.  It is up to the containing widget to pass
 * that percent back into the resizable to update the view.
 */
var Resizable = (function() {
  "use strict";

  var _styles = {

    container: function(width) { return {
      width:    width+"%",
      position: "relative",
      height:   "100%",
    }},

    overlay: function(activelyResizing) { return {
      width:    "100%",
      height:   "100%",
      position: "fixed",
      top:      0,
      left:     0,
      cursor:   "col-resize",
      display:  activelyResizing ? "inline-block" : "none",
    }},

    handle: function(enabled) { return {
      height:     "100%",
      width:      "20px",
      position:   "absolute",
      transform:  "translate(50%, 0)",
      top:        "0",
      right:      "0",
      cursor:     enabled ? "col-resize" : "auto",
    }},

    div: {
      width: "100%"
    }
  };

  return React.createClass({
    displayName: "Resizable",

    propTypes: {
      onChange:     React.PropTypes.func,
      style:        React.PropTypes.object,
      percent:      React.PropTypes.number,
      enabled:      React.PropTypes.bool,
      maxPercent:   React.PropTypes.number,
      minPercent:   React.PropTypes.number,
      handleChild:  React.PropTypes.element,
    },

    getDefaultProps: function() {
      return {
        onChange:     function() { },
        style:        { },
        percent:      100,
        enabled:      true,
        maxPercent:   100,
        minPercent:   0,
      };
    },

    getInitialState: function() {
      return {
        // boolean flag, is resizing currently happening
        activelyResizing: false,
        // width of the div at the start of resizing
        divWidth: -1,
        // percent passed in through props, saved at time of drag start
        propPercent: -1,
      };
    },

    /*
     * Resizing starts when on the mousedown event on the handler div.
     * We need to store the original width of the div so we can later calculate
     * how far the mouse has moved (dragged) as well as the initial percent that
     * the div was at to calculate the final percent the div should be at as it
     * is dragged.
     */
    startResizing: function() {
      if (!this.props.enabled) return;

      this.setState({
        divWidth:         $(React.findDOMNode(this.refs.theDiv)).width(),
        propPercent:      this.props.percent,
        activelyResizing: true,
      });
    },

    /*
     * Sets activelyResizing to false which hides the overlay in the render() method.
     */
    stopResizing: function() {
      this.setState({
        activelyResizing: false
      });
    },

    /*
     * When the mouse is moved we must calculate how far it has moved from the original
     * position of theDiv (and take into account the scoll offset of the window).
     *
     * Compare this difference to the initial width of theDiv to get the percent changes
     * and multiply that by the original percent to get the final percent value.
     *
     * For example:
     *   initial div width (state.divWidth): 400px
     *   initial widget percent (state.propPercent): 80%
     *   mouseX - divLeft: 300px (mouse moved 100px left)
     *
     *   mouse at 75% of start (300/400) so we must updateValue with 75% of propPercent = 60%
     */
    handleMouseMove: function(e) {
      if (!this.props.enabled) return;

      if (this.state.activelyResizing) {
        var mouseX = e.clientX || e.touches[0].pageX;
        var left = $(React.findDOMNode(this.refs.theDiv)).offset().left - window.scrollX;
        var newPct = (mouseX - left) / this.state.divWidth;
        this.updateValue(newPct * this.state.propPercent);
      }
    },

    updateValue: function(newValue) {
      newValue = Math.min(newValue, this.props.maxPercent);
      newValue = Math.max(newValue, this.props.minPercent);
      this.props.onChange(newValue);
    },

    render: function() {
      return (
        React.createElement("div", {style: _styles.container(this.props.percent)}, 
          React.createElement("div", {ref: "theDiv", style: _.extend({}, this.props.style, _styles.div)}, 
            this.props.children
          ), 
          React.createElement("div", {style: _styles.handle(this.props.enabled), 
               onMouseDown: this.startResizing}, 
            this.props.handleChild
          ), 
          React.createElement("div", {style: _styles.overlay(this.state.activelyResizing), 
               onMouseUp: this.stopResizing, 
               onMouseMove: this.handleMouseMove})
        )
      );
    }
  });
})();
