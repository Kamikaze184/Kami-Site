const viewsController = require('./views/views.controller');
const urlShortController = require('./urlShort/urlShort.controller');

module.exports = {
    paths: [viewsController.path, urlShortController.path],
    router: [viewsController.router, urlShortController.router]
}