const { createElement } = require('libraries/element-creater');

const MultipleChoiceOption = props => {
  const {
    selectedOption,
    correctAnswer,
    optionNo,
    option,
    multipleChoiceComponent,
    updateSelectedOption
  } = props;

  const optionRadioElementProps = {
    elementType: 'input',
    attributes: {
      'type': 'radio'
    },
    onClick: () => updateSelectedOption(multipleChoiceComponent, optionNo)
  };

  const optionTextProps = {
    elementType: 'span',
    innerText: option,
    style: {}
  };

  if (optionNo === selectedOption) {
    optionRadioElementProps.attributes.checked = true;
    optionTextProps.innerText = option + (correctAnswer === optionNo ? ' - Correct!' : ' - Incorrect!');
    optionTextProps.style.color = correctAnswer === optionNo ? 'green' : 'red';
  };

  const optionRadioElement = createElement(optionRadioElementProps);
  const optionTextElement = createElement(optionTextProps);

  return createElement({
    elementType: 'div',
    childrenElements: [optionRadioElement, optionTextElement]
  });
};

module.exports = MultipleChoiceOption;
