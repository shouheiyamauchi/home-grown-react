const { component, createElement } = require('libraries/element-creater');
const update = require('immutability-helper');
// const MockDatabase = require('../MockDatabase');
//
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


class Component extends component {
  constructor(props) {
    super(props)

    this.state = {
      blah: 'haha'
    }
  }

  render() {
    const classScope = this;

    const subcategoriesProps = {
      elementType: 'div',
      innerText: this.props.prop,
      onClick: () => {
        // this.parentNode.replaceChild(createElement(subcategoriesProps), this)
        // classScope.state.hello = classScope.state.hello + 'okay '
        // this.parentNode.replaceChild(classScope.render(), this)
        // console.log(this)
        this.props.updater();
      },
      childrenElements: []
    };

    const element = createElement(subcategoriesProps);

    return element;
  }
}


class App extends component {
  constructor(props) {
    super(props)

    this.state = {
      hello: 'yes',
      prop: 'haha'
    }
  }

  updater() {
    console.log(this.state);
  }

  render() {
    const classScope = this;

    const subcategoriesProps = {
      elementType: 'div',
      innerText: classScope.state.hello,
      onClick: () => {
        // this.parentNode.replaceChild(createElement(subcategoriesProps), this)
        // classScope.state.hello = classScope.state.hello + 'okay '
        // this.parentNode.replaceChild(classScope.render(), this)
        // console.log(this)
        // this.updater()
        // this.updateState({hello: this.state.hello + ' hello'}, element)
      },
      childrenElements: [
        new Component({
          updater: () => this.updateState(update(this.state, {hello: {$set: this.state.hello + ' hello'}}), element),
          prop: this.state.prop
        }).render()
      ]
    };

    const element = createElement(subcategoriesProps);

    return element;
  }
}

module.exports = App;
