const { createElement } = require('libraries/element-creater');
const MultipleChoiceQuestion = require('./MultipleChoiceQuestion');
const Text = require('./Text');
const Youtube = require('./Youtube');

const MaterialDisplay = props => {
  const {
    material
  } = props;

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

  return materialDisplay;
};

module.exports = MaterialDisplay;
