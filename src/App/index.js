const { component, createElement } = require('libraries/element-creater');
const update = require('immutability-helper');
const MockDatabase = require('../MockDatabase');
const SelectedLesson = require('./SelectedLesson');
const Category = require('./Category');

class App extends component {
  constructor(props) {
    super(props)

    this.state = {
      selectedLesson: {}
    }

    this.updateOpenedLesson = this.updateOpenedLesson.bind(this);
  }

  updateOpenedLesson(thisComponent, lesson) {
    thisComponent.updateState(update(thisComponent.state, {selectedLesson: {$set: lesson}}), thisComponent.renderedElement)
  }

  setRenderElement() {
    const {
      selectedLesson
    } = this.state;

    const categoryElementProps = {
      elementType: 'div',
      childrenElements: [
        SelectedLesson({
          lesson: selectedLesson
        }),
        new Category({
          appComponent: this,
          updateOpenedLesson: this.updateOpenedLesson,
          selectedLesson,
          category: MockDatabase.categoryWithAllChildren(1)
        }).render()
      ]
    };

    this.renderedElement = createElement(categoryElementProps);
  }
}

module.exports = App;
