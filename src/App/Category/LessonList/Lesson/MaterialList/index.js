const { createElement } = require('libraries/element-creater');
const MultipleChoiceQuestion = require('./MultipleChoiceQuestion');
const Text = require('./Text');
const Youtube = require('./Youtube');

const MaterialList = props => {
  const {
    materials
  } = props;

  return createElement({
    elementType: 'ol',
    childrenElements: materials.map(material => {
      const materialDisplay = {
        MaterialMultipleChoiceQuestion: MultipleChoiceQuestion({ material }),
        MaterialText: Text({ material }),
        MaterialYoutube: Youtube({ material })
      }[material.materialType]

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
              materialDisplay
            ]
          }),
          createElement({ elementType: 'br' })
        ]
      })
    })
  })
};

module.exports = MaterialList;
