const { component, createElement } = require('libraries/element-creater');
const update = require('immutability-helper');
const MockDatabase = require('../MockDatabase');
const Category = require('./Category');

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
    thisComponent.updateState(update(thisComponent.state, {openedLesson: {$set: lesson.name}}), thisComponent.renderedElement)
  }

  setRenderElement() {
    const categoryElementProps = {
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

    this.renderedElement = createElement(categoryElementProps);
  }
}

module.exports = App;
