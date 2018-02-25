const { createElement } = require('libraries/element-creater');

const SelectedLesson = props => {
  const {
    lesson
  } = props;

  return createElement({
    elementType: 'h2',
    innerText: 'Current Lesson: ' + (lesson.name || 'No Lesson Selected')
  })
};

module.exports = SelectedLesson;
