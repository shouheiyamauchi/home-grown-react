var createElement = require('../element-creater');

const sample = {
  type: 'Button',
  props: {
    text: 'there',
    children: []
  }
}

const one = createElement(sample)

const sample2 = {
  type: 'div',
  props: {
    text: '',
    children: [one]
  }
}

const App = createElement(sample2);



module.exports = App;
