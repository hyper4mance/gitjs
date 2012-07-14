var server = require("./server"),
    router = require("./router"),
    requestHandlers = require("./requestHandlers"),
    handle = {};

handle["/getToken"] = requestHandlers.getToken;

server.start(router.route, handle);