(function (G) {
    'use strict';

    buster.testCase('configDefaultsTest', {
        setUp: function () {
            this.gitjs = new G();
        },
        tearDown: function () {
            delete this.gitJs;
        },
        'test that this.gitjs is instance of GitJS': function () {
            assert(this.gitjs instanceof G);
        },
        'test that this.gitjs constructor is GitJs': function () {
            assert.equals(this.gitjs.constructor, G);
        }
    });
}(GitJs));