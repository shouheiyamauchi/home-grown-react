const renderDocument = require('./document-renderer');
const App = require('./App');

document.addEventListener("DOMContentLoaded", function(event) {
  renderDocument(App, document.querySelector('#app'));
});
