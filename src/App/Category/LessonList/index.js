const { createElement } = require('libraries/element-creater');

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
      return createElement({
        elementType: 'li',
        style: {
          'color': 'blue',
          'cursor': 'pointer'
        },
        innerText: lesson.name + (lesson.id === selectedLesson.id ? ' (selected)' : ''),
        onClick: () => updateOpenedLesson(appComponent, lesson)
      })
    })
  })
};

module.exports = LessonList;
