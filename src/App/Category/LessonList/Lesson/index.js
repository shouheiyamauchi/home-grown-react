const { createElement } = require('libraries/element-creater');
const Materials = require('./Materials');

const Lesson = props => {
  const {
    lesson,
    selectedLesson,
    appComponent,
    updateOpenedLesson
  } = props;

  return createElement({
    elementType: 'li',
    style: {
      'color': 'blue',
      'cursor': 'pointer'
    },
    innerText: lesson.name,
    onClick: () => updateOpenedLesson(appComponent, lesson),
    childrenElements: lesson.id === selectedLesson.id ? [Materials({ materials: lesson.materials })] : []
  })
};

module.exports = Lesson;
