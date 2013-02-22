module('authenticateUser Tests', {
    setup: function () {
        this.server = sinon.fakeServer.create();
        this.server.respondWith('GET', /https:\/\/api.github.com\/user\?access_token=.+/, [200, {
            'Content-Type': 'application/json'
        }, '{}']);
        this.gitJs = new GitJs({
            accessToken: '1234456'
        });
    },
    teardown: function () {
        this.server.restore();
        delete this.gitJs;
        delete this.server;
    }
});
test('test that callback is called when using default token', function() {
    var callback = this.spy();

    this.gitJs.authenticateUser(callback);
    this.server.respond();
    ok(callback.called);
});

test('test that callback is called when using passed in token', function() {
    var callback = this.spy(),
        gitJs = new GitJs();

    gitJs.authenticateUser(callback, '56789');
    this.server.respond();
    ok(callback.called);
});