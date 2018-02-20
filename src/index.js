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
