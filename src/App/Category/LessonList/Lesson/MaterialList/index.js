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
      let materialDisplay

      switch(material.materialType) {
        case 'MaterialMultipleChoiceQuestion':
          materialDisplay = new MultipleChoiceQuestion({ material }).render();
          break;
        case 'MaterialText':
          materialDisplay = Text({ material });
          break;
        case 'MaterialYoutube':
          materialDisplay = Youtube({ material });
          break;
      };

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
      });
    })
  });
};

module.exports = MaterialList;
