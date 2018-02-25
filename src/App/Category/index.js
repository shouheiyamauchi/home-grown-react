const { component, createElement } = require('libraries/element-creater');
const CategoryTitle = require('./CategoryTitle');
const LessonList = require('./LessonList');

class Category extends component {
  constructor(props) {
    super(props);
  }

  setRenderElement() {
    const {
      appComponent,
      updateOpenedLesson,
      selectedLesson,
      category
    } = this.props;

    // render children categories recursively
    const subCategoryElements = category.categories.map(childCategory => {
      return new Category({
        appComponent,
        updateOpenedLesson,
        selectedLesson,
        category: childCategory
      }).render()
    });

    const categoryElementProps = {
      elementType: 'div',
      style: {
        'padding-left': '15px'
      },
      childrenElements: [CategoryTitle({ category })].concat(subCategoryElements)
    };

    const categoryElement = createElement(categoryElementProps);

    const categoryAndLessonElementProps = {
      elementType: 'div',
      childrenElements: [
        categoryElement,
        LessonList({
          lessons: category.lessons,
          appComponent,
          updateOpenedLesson,
          selectedLesson
        })
      ]
    };

    this.renderedElement = createElement(categoryAndLessonElementProps);
  }
}

module.exports = Category;
