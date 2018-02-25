const { createElement } = require('libraries/element-creater');

const Materials = props => {
  const {
    materials
  } = props;

  return createElement({
    elementType: 'ol',
    childrenElements: materials.map(material => {
      return createElement({
        elementType: 'li',
        style: {
          'color': 'black',
          'cursor': 'auto'
        },
        innerText: material.title
      })
    })
  })
};

module.exports = Materials;
