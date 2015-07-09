require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var React = require('react');
var Resizable = require('react-resizable');

var Demo = (function () {
  'use strict';

  var datastore = {
    percent: 40
  };

  var _styles = {
    resizable: function resizable(background) {
      return {
        background: background,
        color: 'black',
        textAlign: 'center',
        fontSize: '12px',
        padding: '10px'
      };
    },

    resizableHandle: {
      background: 'black',
      position: 'relative',
      margin: 'auto',
      height: '150%',
      width: '4px',
      top: '-25%'
    }
  };

  return React.createClass({
    displayName: 'Demo',

    resizableChange: function resizableChange(val) {
      // hack together a dispatcher and global datastore for the demo
      datastore.percent = Math.floor(val);
      this.forceUpdate();
    },

    getText: function getText(percent) {
      if (percent == 100) {
        return 'You did it!';
      } else if (percent >= 90) {
        return 'You are soooo close!';
      } else if (percent >= 80) {
        return 'You can do better than this!';
      } else if (percent >= 70) {
        return 'Are you even trying?';
      } else if (percent >= 60) {
        return 'I know you have it in you!';
      } else if (percent >= 50) {
        return 'Can you go all the way?';
      } else if (percent >= 40) {
        return 'Play with me!';
      } else if (percent >= 30) {
        return 'Wrong way!';
      } else {
        return ':(';
      }
    },

    getHSLColor: function getHSLColor(percent) {
      var hue = percent / 100 * 120;
      return 'hsl(' + hue + ', 80%, 70%)';
    },

    render: function render() {
      var percent = datastore.percent;
      var text = this.getText(percent);
      var background = this.getHSLColor(percent);
      var handleRender = React.createElement('div', { style: _styles.resizableHandle });
      return React.createElement(
        'div',
        null,
        React.createElement(
          Resizable,
          { onChange: this.resizableChange,
            percent: percent,
            maxPercent: 100,
            minPercent: 10,
            handleChild: handleRender },
          React.createElement(
            'div',
            { style: _styles.resizable(background) },
            text
          )
        )
      );
    }
  });
})();

React.render(React.createElement(Demo, null), document.getElementById('app'));

},{"react":undefined,"react-resizable":undefined}]},{},[1]);
