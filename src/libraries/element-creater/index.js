class component {
  constructor(props) {
    this.props = props;
    this.state = {};
    this.renderedElement = '';
    // return this.render();
  }

  updateState(newState, componentElement) {
    this.state = newState;
    componentElement.parentNode.replaceChild(this.render(), componentElement);
  }

  render() {
  }
}

// function createElement(elementProperties) {
//   const element = document.createElement(elementProperties.type);
//   element.innerHTML = elementProperties.props.text;
//
//   elementProperties.props.children.forEach(function(child) {
//     element.appendChild(child);
//   });
//
//   return element;
// }

function createElement(elementProperties) {
  const {
    elementType,
    style,
    innerText,
    onClick,
    childrenElements
  } = elementProperties;

  const element = document.createElement(elementType);
  if (style) Object.keys(style).forEach(function(styleName) {
    element.style[styleName] = style[styleName];
  })

  element.innerHTML = innerText || '';
  element.onclick = onClick

  if (childrenElements) childrenElements.forEach(function(child) {
    element.appendChild(child);
  });

  return element;
}

module.exports = { component, createElement };
