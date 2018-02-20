(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
function renderDocument(elements) {
  const app = document.querySelector('#app')
  app.appendChild(elements)
}

module.exports = renderDocument;

},{}],2:[function(require,module,exports){
var renderDocument = require('./home-grown-react');

const sample = {
  type: 'Button',
  props: {
    text: 'there',
    children: []
  }
}

const one = createElement(sample)

const sample2 = {
  type: 'div',
  props: {
    text: '',
    children: [one]
  }
}

const two = createElement(sample2)

function createElement(elementProperties) {
  const element = document.createElement(elementProperties.type);
  element.innerHTML = elementProperties.props.text;

  elementProperties.props.children.forEach(function(child) {
    element.appendChild(child)
  });

  return element;
}



document.addEventListener("DOMContentLoaded", function(event) {
  renderDocument(two);
});

},{"./home-grown-react":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92OC41LjAvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaG9tZS1ncm93bi1yZWFjdC9pbmRleC5qcyIsInNyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9cmV0dXJuIGV9KSgpIiwiZnVuY3Rpb24gcmVuZGVyRG9jdW1lbnQoZWxlbWVudHMpIHtcbiAgY29uc3QgYXBwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FwcCcpXG4gIGFwcC5hcHBlbmRDaGlsZChlbGVtZW50cylcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZW5kZXJEb2N1bWVudDtcbiIsInZhciByZW5kZXJEb2N1bWVudCA9IHJlcXVpcmUoJy4vaG9tZS1ncm93bi1yZWFjdCcpO1xuXG5jb25zdCBzYW1wbGUgPSB7XG4gIHR5cGU6ICdCdXR0b24nLFxuICBwcm9wczoge1xuICAgIHRleHQ6ICd0aGVyZScsXG4gICAgY2hpbGRyZW46IFtdXG4gIH1cbn1cblxuY29uc3Qgb25lID0gY3JlYXRlRWxlbWVudChzYW1wbGUpXG5cbmNvbnN0IHNhbXBsZTIgPSB7XG4gIHR5cGU6ICdkaXYnLFxuICBwcm9wczoge1xuICAgIHRleHQ6ICcnLFxuICAgIGNoaWxkcmVuOiBbb25lXVxuICB9XG59XG5cbmNvbnN0IHR3byA9IGNyZWF0ZUVsZW1lbnQoc2FtcGxlMilcblxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudChlbGVtZW50UHJvcGVydGllcykge1xuICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVtZW50UHJvcGVydGllcy50eXBlKTtcbiAgZWxlbWVudC5pbm5lckhUTUwgPSBlbGVtZW50UHJvcGVydGllcy5wcm9wcy50ZXh0O1xuXG4gIGVsZW1lbnRQcm9wZXJ0aWVzLnByb3BzLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGQpIHtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkKVxuICB9KTtcblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxuXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gIHJlbmRlckRvY3VtZW50KHR3byk7XG59KTtcbiJdfQ==
