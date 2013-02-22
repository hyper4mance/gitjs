module('getGistComments Tests', {
    setup: function () {
        var serverResponse = [{
            'id': 1,
            'url': 'https://api.github.com/gists/fd2f141e9fa727538e79/comments/',
            'body': 'Just commenting for the sake of commenting',
            'user': {
                'login': 'octocat',
                'id': 1,
                'avatar_url': 'https://github.com/images/error/octocat_happy.gif',
                'gravatar_id': 'somehexcode',
                'url': 'https://api.github.com/users/octocat'
            },
            'created_at': '2011-04-18T23:23:56Z'
        }];

        this.gistId = 'fd2f141e9fa727538e79';
        this.gitJs = new GitJs();
        this.server = sinon.fakeServer.create();

        this.server.respondWith('GET', /https:\/\/api.github.com\/gists\/.+\/comments/, [200, {
            'Content-Type': 'application/json'
        }, JSON.stringify(serverResponse)]);

        this.server.respondWith('GET', /https:\/\/api.github.com\/gists\/.+\/comments\/\d+/, [200, {
            'Content-Type': 'application/json'
        }, JSON.stringify(serverResponse)]);
    },
    teardown: function () {
        this.server.restore();

        delete this.gistId;
        delete this.gitJs;
        delete this.server;
    }
});

test('test callback is called when getting all comments', function () {
    var callback = this.spy();

    this.gitJs.getGistComments(callback, this.gistId);
    this.server.respond();
    ok(callback.called);
});

test('test callback is called when getting a single comment', function () {
    var callback = this.spy();

    this.gitJs.getGistComments(callback, this.gistId, {
        commentId: 1
    });

    this.server.respond();
    ok(callback.called);
});

test('test that invalid comment Ids get ignored', function () {
    var callback = this.spy();

    this.gitJs.getGistComments(callback, this.gistId, {
        commentId: 'badValue'
    });

    this.server.respond();

    equal(this.server.requests[0].url, 'https://api.github.com/gists/' + this.gistId + '/comments');
});