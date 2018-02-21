const createElement = require('../libraries/element-creater');
const MockDatabase = require('../MockDatabase');

const parentCategory = MockDatabase.categoryWithAllChildren(1);

function renderCategory(category) {
  const categoryTitleProps = {
    type: 'div',
    props: {
      text: category.name,
      children: renderLessons(category)
    }
  };
  const categoryTitle = createElement(categoryTitleProps);

  const categoryProps = {
    type: 'div',
    props: {
      text: '',
      children: [categoryTitle, renderSubcategories(category)]
    }
  };

  return createElement(categoryProps);
};

const parentContainer = createElement({
  type: 'div',
  props: {
    text: '',
    children: [renderCategory(parentCategory)]
  }
});

function renderLessons(category) {
  const lessons = category.lessons.map(lesson => {
    const lessonProps = {
      type: 'div',
      props: {
        text: '',
        children: [renderLesson(lesson)]
      }
    };

    return createElement(lessonProps);
  });

  return lessons;
};

function renderLesson(lesson) {
  const lessonProps = {
    type: 'em',
    props: {
      text: lesson.name + ' - ' + lesson.description,
      children: []
    }
  };

  return createElement(lessonProps);
};

function renderSubcategories(parentCategory) {
  const subcategories = parentCategory.categories.length ? (
    parentCategory.categories.map(category => {
      subCategoriesItem = {
        type: 'li',
        props: {
          text: '',
          children: [renderCategory(category)]
        }
      };

      return createElement(subCategoriesItem);
    })
  ) : [];

  const subcategoriesList = {
    type: 'ul',
    props: {
      text: '',
      children: subcategories
    }
  };

  const subcategoriesProps = {
    type: 'div',
    props: {
      text: '',
      children: [createElement(subcategoriesList)]
    }
  }

  return createElement(subcategoriesProps);
};

const App = parentContainer;

module.exports = App;
