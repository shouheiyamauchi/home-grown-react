const { component, createElement } = require('libraries/element-creater');
const update = require('immutability-helper');
const MockDatabase = require('../MockDatabase');

// const parentCategory = MockDatabase.categoryWithAllChildren(1);
//
// function renderCategory(category) {
//   const categoryTitleProps = {
//     type: 'div',
//     props: {
//       text: category.name,
//       children: renderLessons(category)
//     }
//   };
//   const categoryTitle = createElement(categoryTitleProps);
//
//   const categoryProps = {
//     type: 'div',
//     props: {
//       text: '',
//       children: [categoryTitle, renderSubcategories(category)]
//     }
//   };
//
//   return createElement(categoryProps);
// };
//
// const parentContainer = createElement({
//   type: 'div',
//   props: {
//     text: '',
//     children: [renderCategory(parentCategory)]
//   }
// });
//
// function renderLessons(category) {
//   const lessons = category.lessons.map(lesson => {
//     const lessonProps = {
//       type: 'div',
//       props: {
//         text: '',
//         children: [renderLesson(lesson)]
//       }
//     };
//
//     return createElement(lessonProps);
//   });
//
//   return lessons;
// };
//
// function renderLesson(lesson) {
//   const lessonProps = {
//     type: 'em',
//     props: {
//       text: lesson.name + ' - ' + lesson.description,
//       children: []
//     }
//   };
//
//   return createElement(lessonProps);
// };
//
// function renderSubcategories(parentCategory) {
//   const subcategories = parentCategory.categories.length ? (
//     parentCategory.categories.map(category => {
//       subCategoriesItem = {
//         type: 'li',
//         props: {
//           text: '',
//           children: [renderCategory(category)]
//         }
//       };
//
//       return createElement(subCategoriesItem);
//     })
//   ) : [];
//
//   const subcategoriesList = {
//     type: 'ul',
//     props: {
//       text: '',
//       children: subcategories
//     }
//   };
//
//   const subcategoriesProps = {
//     type: 'div',
//     props: {
//       text: '',
//       children: [createElement(subcategoriesList)]
//     }
//   };
//
//   // return createElement(subcategoriesProps);
//
//   class eg extends component {
//     constructor(elementProperties) {
//       super(elementProperties)
//     }
//   };
//
//   return new eg(subcategoriesProps);
// };
//
// const App = parentContainer;


class Category extends component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      appComponent,
      updateOpenedLesson,
      category
    } = this.props;

    const categoryTitle = createElement({
      elementType: 'h3',
      innerText: category.name
    })

    const categoryElementProps = {
      elementType: 'div',
      style: {
        'padding-left': '15px'
      },
      childrenElements: [categoryTitle].concat(category.categories.map(childCategory => {
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

    return createElement(categoryAndLessonProps);
  }
}


class App extends component {
  constructor(props) {
    super(props)

    this.state = {
      openedLesson: '',
      element: ''
    }

     this.updateOpenedLesson = this.updateOpenedLesson.bind(this);
  }

  updateOpenedLesson(lesson, thisComponent) {
    thisComponent.updateState(update(thisComponent.state, {openedLesson: {$set: lesson.name}}), thisComponent.state.element)
  }

  render() {
    const subcategoriesProps = {
      elementType: 'div',
      innerText: this.state.openedLesson,
      childrenElements: [
        new Category({
          appComponent: this,
          updateOpenedLesson: this.updateOpenedLesson,
          category: MockDatabase.categoryWithAllChildren(1)
        }).render()
      ]
    };

    this.state.element = createElement(subcategoriesProps);

    return this.state.element;
  }
}

module.exports = App;
