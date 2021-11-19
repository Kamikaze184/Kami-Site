const viewsController = require('./views/views.controller');

module.exports = {
    paths: [viewsController.path],
    router: [viewsController.router]
}