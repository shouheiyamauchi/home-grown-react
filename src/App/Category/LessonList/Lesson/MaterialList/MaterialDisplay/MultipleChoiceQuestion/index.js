const { component, createElement } = require('libraries/element-creater');
const update = require('immutability-helper');
const MultipleChoiceOption = require('./MultipleChoiceOption');

class MultipleChoiceQuestion extends component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: null
    };
  }

  updateSelectedOption(thisComponent, selectedOption) {
    thisComponent.updateState(update(thisComponent.state, {selectedOption: {$set: selectedOption}}), thisComponent.renderedElement)
  }

  setRenderElement() {
    const {
      updateSelectedOption
    } = this;

    const {
      selectedOption
    } = this.state;

    const {
      material
    } = this.props;

    const multipleChoiceOptionsElementProps = {
      elementType: 'ol',
      childrenElements: material.options.map((option, index) => {
        return createElement({
          elementType: 'li',
          childrenElements: [
            MultipleChoiceOption({
              selectedOption,
              correctAnswer: material.correct_answer,
              optionNo: index,
              option,
              multipleChoiceComponent: this,
              updateSelectedOption
            })
          ]
        });
      })
    };

    const multipleChoiceOptionsElement = createElement(multipleChoiceOptionsElementProps);

    const multipleChoiceContainerProps = {
      elementType: 'div',
      innerText: material.question,
      childrenElements: [multipleChoiceOptionsElement]
    };

    this.renderedElement = createElement(multipleChoiceContainerProps);
  }
};

module.exports = MultipleChoiceQuestion;
