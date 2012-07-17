var server = require("./server"),
    router = require("./router"),
    requestHandlers = require("./requestHandlers"),
    handle = {};

handle["/getToken"] = requestHandlers.getToken;
handle["/checkStatus"] = requestHandlers.checkStatus;

server.start(router.route, handle);