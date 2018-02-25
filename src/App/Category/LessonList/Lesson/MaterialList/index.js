const { createElement } = require('libraries/element-creater');
const MaterialDisplay = require('./MaterialDisplay');

const MaterialList = props => {
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
        innerText: material.title,
        childrenElements: [
          createElement({
            elementType: 'div',
            childrenElements: [
              MaterialDisplay({ material })
            ]
          }),
          createElement({ elementType: 'br' })
        ]
      });
    })
  });
};

module.exports = MaterialList;
