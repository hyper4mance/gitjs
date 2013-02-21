/*globals buster:true, $:true, GitJs:true*/

(function (G) {
    'use strict';

    module('getGistComments Tests', {
        setup: function () {
            var serverResponse = [{
                "id": 1296269,
                "owner": {
                    "login": "octocat",
                    "id": 1,
                    "avatar_url": "https://github.com/images/error/octocat_happy.gif",
                    "gravatar_id": "somehexcode",
                    "url": "https://api.github.com/users/octocat"
                },
                "name": "Hello-World",
                "full_name": "octocat/Hello-World",
                "description": "This your first repo!",
                "private": false,
                "fork": false,
                "url": "https://api.github.com/repos/octocat/Hello-World",
                "html_url": "https://github.com/octocat/Hello-World",
                "clone_url": "https://github.com/octocat/Hello-World.git",
                "git_url": "git://github.com/octocat/Hello-World.git",
                "ssh_url": "git@github.com:octocat/Hello-World.git",
                "svn_url": "https://svn.github.com/octocat/Hello-World",
                "mirror_url": "git://git.example.com/octocat/Hello-World",
                "homepage": "https://github.com",
                "language": null,
                "forks": 9,
                "forks_count": 9,
                "watchers": 80,
                "watchers_count": 80,
                "size": 108,
                "master_branch": "master",
                "open_issues": 0,
                "pushed_at": "2011-01-26T19:06:43Z",
                "created_at": "2011-01-26T19:01:12Z",
                "updated_at": "2011-01-26T19:14:43Z"
            }]

            this.gistId = 'fd2f141e9fa727538e79';
            this.gitJs = new G();
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

        console.log(this.server.requests[0]);
        this.server.respond();
        ok(callback.called);
    });
}(GitJs));
