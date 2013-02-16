
(function (G) {
    'use strict';

    buster.testCase('createIssue', {
        setUp: function () {
            testSetUp.call(this, G);
        },
        tearDown: function () {
            testTearDown.call(this, G);
        },

        'test that create issues sends request': function() {

            this.gitJs.createIssue(function() {}, 'opnsrce', {
                title: 'my issue'
            });
            this.server.respond();

            assert.match(this.server.requests[0], {
                method: 'POST',
                url: expectedUrl
            });
        }
    });

}(GitJs));
