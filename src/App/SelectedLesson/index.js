const { createElement } = require('libraries/element-creater');
const CloseLessonButton = require('./CloseLessonButton');

const SelectedLesson = props => {
  const {
    lesson,
    appComponent,
    updateOpenedLesson
  } = props;

  return createElement({
    elementType: 'h2',
    innerText: 'Current Lesson: ' + (lesson.name || 'No Lesson Selected'),
    childrenElements: [
      createElement({ elementType: 'br' }),
      CloseLessonButton({ lesson, appComponent, updateOpenedLesson })
    ]
  });
};

module.exports = SelectedLesson;
