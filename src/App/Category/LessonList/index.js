const { createElement } = require('libraries/element-creater');
const Lesson = require('./Lesson');

const LessonList = props => {
  const {
    lessons,
    appComponent,
    updateOpenedLesson,
    selectedLesson
  } = props;

  return createElement({
    elementType: 'ul',
    childrenElements: lessons.map(lesson => {
      return Lesson({ lesson, selectedLesson, appComponent, updateOpenedLesson });
    })
  })
};

module.exports = LessonList;
