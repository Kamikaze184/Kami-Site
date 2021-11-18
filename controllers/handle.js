const apiController = require('./api/api.controller');
const viewsController = require('./views/views.controller');

module.exports = {
    paths: [viewsController.path, /*apiController.path*/],
    router: [viewsController.router, /*apiController.router*/]
}