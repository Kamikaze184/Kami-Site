const glob = require('fast-glob');

module.exports = class handleControllers {
    constructor() {
        var controllers = glob.sync(["**/controllers/**/*.controller.js", "!node_modules", "!public", "!views"],)

        const paths = new Array();
        const routers = new Array();

        controllers.forEach(c => {
            const controller = require(process.cwd() + "/" + c)

            paths.push(controller.path);
            routers.push(controller.router);
        })

        return {
            paths,
            routers
        }
    }
}
