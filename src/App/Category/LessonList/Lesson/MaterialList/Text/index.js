const { createElement } = require('libraries/element-creater');

const Text = props => {
  const {
    material
  } = props;

  return createElement({
    elementType: 'em',
    innerText: material.description
  })
};

module.exports = Text;
