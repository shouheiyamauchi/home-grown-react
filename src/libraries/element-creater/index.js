class component {
  constructor(props) {
    this.props = props;
    this.state = {};
    this.renderedElement = '';
    // return this.render();
  }

  updateState(newState, htmlScope) {
    this.state = newState;
    htmlScope.parentNode.replaceChild(this.render(), htmlScope);
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
    innerText,
    onClick,
    childrenElements
  } = elementProperties;

  const element = document.createElement(elementType);
  element.innerHTML = innerText;
  element.onclick = onClick

  childrenElements.forEach(function(child) {
    element.appendChild(child);
  });

  return element;
}

module.exports = { component, createElement };
