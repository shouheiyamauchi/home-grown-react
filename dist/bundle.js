(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
var createElement = require('../element-creater');

const sample = {
  type: 'Button',
  props: {
    text: 'there',
    children: []
  }
};

const one = createElement(sample);

const sample2 = {
  type: 'div',
  props: {
    text: '',
    children: [one]
  }
};

const App = createElement(sample2);

module.exports = App;

},{"../element-creater":3}],2:[function(require,module,exports){
function renderDocument(elements, DOMSelector) {
  DOMSelector.appendChild(elements);
}

module.exports = renderDocument;

},{}],3:[function(require,module,exports){
function createElement(elementProperties) {
  const element = document.createElement(elementProperties.type);
  element.innerHTML = elementProperties.props.text;

  elementProperties.props.children.forEach(function (child) {
    element.appendChild(child);
  });

  return element;
}

module.exports = createElement;

},{}],4:[function(require,module,exports){
const renderDocument = require('./document-renderer');
const App = require('./App');

document.addEventListener("DOMContentLoaded", function (event) {
  renderDocument(App, document.querySelector('#app'));
});

},{"./App":1,"./document-renderer":2}]},{},[4]);
