const { createElement } = require('libraries/element-creater');
const MaterialList = require('./MaterialList');

const Lesson = props => {
  const {
    lesson,
    selectedLesson,
    appComponent,
    updateOpenedLesson
  } = props;

  const lessonElementProps = {
    elementType: 'li',
    style: {
      'color': 'blue',
      'cursor': 'pointer'
    },
    innerText: lesson.name
  };

  const openLesson = () => updateOpenedLesson(appComponent, lesson);
  const closeLesson = () => updateOpenedLesson(appComponent, {});

  if (lesson.id === selectedLesson.id) {
    lessonElementProps.onClick = closeLesson;
    lessonElementProps.childrenElements = [MaterialList({ materials: lesson.materials })]
  } else {
    lessonElementProps.onClick = openLesson;
  };

  return createElement(lessonElementProps);
};

module.exports = Lesson;
