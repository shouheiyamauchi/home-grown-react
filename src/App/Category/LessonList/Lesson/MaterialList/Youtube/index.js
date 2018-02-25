const { createElement } = require('libraries/element-creater');

const Youtube = props => {
  const {
    material
  } = props;

  return createElement({
    elementType: 'iframe',
    attributes: {
      'width': '280',
      'height': '160',
      'src': material.video_url,
      'frameborder': '0'
    }
  });
};

module.exports = Youtube;
