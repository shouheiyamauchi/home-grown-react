class component {
  constructor(props) {
    this.props = props;
    this.state = {};
    this.renderedElement = '';
  }

  updateState(newState, componentElement) {
    this.state = newState;
    componentElement.parentNode.replaceChild(this.render(), componentElement);
  }

  setRenderElement() {
  }

  render() {
    this.setRenderElement();
    return this.renderedElement;
  }
}

const createElement = elementProperties => {
  const {
    elementType,
    style,
    attributes,
    innerText,
    onClick,
    childrenElements
  } = elementProperties;

  const element = document.createElement(elementType);

  if (style) Object.keys(style).forEach(styleName => {
    element.style[styleName] = style[styleName];
  });

  if (attributes) Object.keys(attributes).forEach(attributeName => {
    element.setAttribute(attributeName, attributes[attributeName]);
  });

  element.innerHTML = innerText || '';

  element.onclick = onClick;

  if (childrenElements) childrenElements.forEach(child => {
    element.appendChild(child);
  });

  return element;
}

module.exports = { component, createElement };
