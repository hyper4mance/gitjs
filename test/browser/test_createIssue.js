
(function (G) {
    'use strict';
    
    buster.testCase('createIssue', {
        setUp: function () {
            testSetUp.call(this, G);
        },
        tearDown: function () {
            testTearDown.call(this, G);
        },
        'test createIssue with minimal options': {
            setUp: function() {
                this.title = 'My Test Issue';
                this.user = 'opnsrce',
                this.repo = 'testrepo',
                this.options = {
                    title: this.title
                }
            },
            tearDown: function() {
                delete this.title;
                delete this.user;
                delete this.options.title;
                delete this.options;
            },
            'test that createIssue calls the callback that it is passed' : function () {
                var callback = this.spy();

                this.gitjs.createIssue(callback, this.user, this.repo, this.options);
                assert.called(callback);
            },
            'test apiRequest Formatting' : {
                setUp: function() {
                    this.apiRequest = this.gitjs.createIssue(function () {}, this.user, this.repo, this.options);
                },
                tearDown : function() {
                    delete this.apiRequest;
                },
                'test createIssue apiRequestFormatting - URL' : function () {
                    assert.equals(this.apiRequest.url, 'https://api.github.com/repos/' + this.user + '/' + this.repo + '/issues', 'ApiRequest URL not set properly');
                },
                'test createIssue apiRequestFormatting - Title' : function () {
                    assert.equals(this.apiRequest.data.title, this.title, 'ApiRequest title not set properly');
                },
                'test createIssue apiRequestFormatting - Data Type' : function () {
                    assert.equals(this.apiRequest.data.dataType, 'POST', 'ApiRequest called using the wrong data type. Should be POST');
                }
            }
        }


        /**
        'test createIssue with title, body': function () {
            var title = 'my test issue',
                body = 'this is broken',
                user = 'opnsrce',
                repo = 'gitjs-test-repo',
                options = {
                    title: title,
                    body: body
                };

            this.gitjs.createIssue(function () {}, user, repo, options);
            assert.isObject(this.apiRequest);
            assert(this.gitjs.sendApiRequestCalled);
            assert.equals('https://api.github.com/repos/' + user + '/' + repo + '/issues', this.apiRequest.url);
            assert.equals('json', this.apiRequest.dataType);
            assert.equals('POST', this.apiRequest.httpVerb);
            assert.equals(this.apiRequest.data.title, title);
            assert.equals(this.apiRequest.data.body, body);
            refute.defined(this.apiRequest.data.assignee);
            refute.defined(this.apiRequest.data.milestone);
            refute.defined(this.apiRequest.data.labels);
        },
        'test createIssue with title, assignee': function () {
            var title = 'my test issue',
                body = 'this is broken',
                user = 'opnsrce',
                repo = 'gitjs-test-repo',
                assignee = 'opnsrce',
                options = {
                    title: title,
                    body: body,
                    assignee: assignee
                };

            this.gitjs.createIssue(function () {}, user, repo, options);
            assert.isObject(this.apiRequest);
            assert(this.gitjs.sendApiRequestCalled);
            assert.equals('https://api.github.com/repos/' + user + '/' + repo + '/issues', this.apiRequest.url);
            assert.equals('json', this.apiRequest.dataType);
            assert.equals('POST', this.apiRequest.httpVerb);
            assert.equals(this.apiRequest.data.title, title);
            assert.equals(this.apiRequest.data.body, body);
            assert.equals(this.apiRequest.data.assignee, assignee);
            refute.defined(this.apiRequest.data.milestone);
            refute.defined(this.apiRequest.data.labels);
        },
        'test createIssue with title, assignee, milestone': function () {
            var title = 'my test issue',
                body = 'this is broken',
                user = 'opnsrce',
                repo = 'gitjs-test-repo',
                assignee = 'opnsrce',
                milestone = 'version 1',
                options = {
                    title: title,
                    body: body,
                    assignee: assignee,
                    milestone: milestone
                };

            this.gitjs.createIssue(function () {}, user, repo, options);
            assert.isObject(this.apiRequest);
            assert(this.gitjs.sendApiRequestCalled);
            assert.equals('https://api.github.com/repos/' + user + '/' + repo + '/issues', this.apiRequest.url);
            assert.equals('json', this.apiRequest.dataType);
            assert.equals('POST', this.apiRequest.httpVerb);
            assert.equals(this.apiRequest.data.title, title);
            assert.equals(this.apiRequest.data.body, body);
            assert.equals(this.apiRequest.data.assignee, assignee);
            assert.equals(this.apiRequest.data.milestone, milestone);
            refute.defined(this.apiRequest.data.labels);
        },
        'test createIssue with title, assignee, milestone, labels': function () {
            var title = 'my test issue',
                body = 'this is broken',
                user = 'opnsrce',
                repo = 'gitjs-test-repo',
                assignee = 'opnsrce',
                milestone = 'version 1',
                labels = ['1', '2', '3'],
                options = {
                    title: title,
                    body: body,
                    assignee: assignee,
                    milestone: milestone,
                    labels: labels
                };

            this.gitjs.createIssue(function () {}, user, repo, options);
            assert.isObject(this.apiRequest);
            assert(this.gitjs.sendApiRequestCalled);
            assert.equals('https://api.github.com/repos/' + user + '/' + repo + '/issues', this.apiRequest.url);
            assert.equals('json', this.apiRequest.dataType);
            assert.equals('POST', this.apiRequest.httpVerb);
            assert.equals(this.apiRequest.data.title, title);
            assert.equals(this.apiRequest.data.body, body);
            assert.equals(this.apiRequest.data.assignee, assignee);
            assert.equals(this.apiRequest.data.milestone, milestone);
            assert.equals(this.apiRequest.data.labels, labels);
        } */
    });

}(GitJs));