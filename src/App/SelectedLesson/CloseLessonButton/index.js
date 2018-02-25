const { createElement } = require('libraries/element-creater');

const CloseLessonButton = props => {
  const {
    lesson,
    appComponent,
    updateOpenedLesson
  } = props;

  closeLessonButtonElementProps = {
    elementType: 'button',
    innerText: 'Close Lesson',
    attributes: {},
    onClick: () => updateOpenedLesson(appComponent, {})
  };

  // close lesson button only clickable when class is selected
  if (!lesson.id) closeLessonButtonElementProps.attributes.disabled = true;

  return createElement(closeLessonButtonElementProps);
};

module.exports = CloseLessonButton;
