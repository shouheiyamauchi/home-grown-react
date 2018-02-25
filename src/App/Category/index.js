const { component, createElement } = require('libraries/element-creater');
const CategoryTitle = require('./CategoryTitle');

class Category extends component {
  constructor(props) {
    super(props);
  }

  setRenderElement() {
    const {
      appComponent,
      updateOpenedLesson,
      category
    } = this.props;

    const categoryElementProps = {
      elementType: 'div',
      style: {
        'padding-left': '15px'
      },
      childrenElements: [CategoryTitle({category})].concat(category.categories.map(childCategory => {
        return new Category({
          appComponent: appComponent,
          updateOpenedLesson: updateOpenedLesson,
          category: childCategory
        }).render()
      }))
    };

    const categoryElement = createElement(categoryElementProps);

    const lessonList = createElement({
      elementType: 'ul',
      childrenElements: category.lessons.map(lesson => {
        return createElement({
          elementType: 'li',
          style: {
            'color': 'blue',
            'cursor': 'pointer'
          },
          innerText: lesson.name,
          onClick: () => updateOpenedLesson(lesson, appComponent)
        })
      })
    })

    const categoryAndLessonProps = {
      elementType: 'div',
      childrenElements: [categoryElement, lessonList]
    }

    this.renderedElement = createElement(categoryAndLessonProps);
  }
}

module.exports = Category;
