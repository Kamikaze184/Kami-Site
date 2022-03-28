const glob = require('fast-glob');

module.exports = class handleControllers {
    constructor(client) {
        var controllers = glob.sync(["**/controllers/**/*.controller.js", "!node_modules", "!public", "!views"],)

        const paths = new Array();
        const routers = new Array();

        controllers.forEach(c => {
            const controller = require(process.cwd() + "/" + c)
            const router = new controller(client)

            paths.push(router.path);
            routers.push(router.router);
        })

        return {
            paths,
            routers
        }
    }
}
