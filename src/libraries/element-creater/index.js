class component {
  constructor(elementProperties) {
    this.elementProperties = elementProperties;

    return this.render();
  }

  render() {
    return createElement(this.elementProperties);
  }
}

function createElement(elementProperties) {
  const element = document.createElement(elementProperties.type);
  element.innerHTML = elementProperties.props.text;

  elementProperties.props.children.forEach(function(child) {
    element.appendChild(child);
  });

  return element;
}

module.exports = { component, createElement };
