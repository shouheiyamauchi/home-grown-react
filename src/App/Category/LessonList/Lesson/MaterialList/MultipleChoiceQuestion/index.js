const { createElement } = require('libraries/element-creater');

const MultipleChoiceQuestion = props => {
  const {
    material
  } = props;

  return createElement({
    elementType: 'div',
    innerText: 'Material'
  })
};

module.exports = MultipleChoiceQuestion;
