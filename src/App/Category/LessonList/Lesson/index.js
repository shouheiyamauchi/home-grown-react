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

  if (lesson.id === selectedLesson.id) {
    lessonElementProps.childrenElements = [MaterialList({ materials: lesson.materials })];
  } else {
    lessonElementProps.onClick = () => updateOpenedLesson(appComponent, lesson);
  };

  return createElement(lessonElementProps);
};

module.exports = Lesson;
