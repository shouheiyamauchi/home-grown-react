const { createElement } = require('libraries/element-creater');

const CategoryTitle = props => {
  const {
    category
  } = props;

  return createElement({
    elementType: 'h3',
    innerText: category.name
  })
};

module.exports = CategoryTitle;
