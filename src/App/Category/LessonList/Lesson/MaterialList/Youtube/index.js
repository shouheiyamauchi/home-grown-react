const { createElement } = require('libraries/element-creater');

const Youtube = props => {
  const {
    material
  } = props;

  return createElement({
    elementType: 'iframe',
    attributes: {
      'width': '560',
      'height': '315',
      'src': material.video_url,
      'frameborder': '0'
    }
  })
};

module.exports = Youtube;
