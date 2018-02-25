const { renderDocument } = require('libraries/document-renderer');
const App = require('./App');

document.addEventListener("DOMContentLoaded", function(event) {
  renderDocument(new App().render(), document.querySelector('#app'));
});
