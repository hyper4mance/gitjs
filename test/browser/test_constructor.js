(function (G) {
    'use strict';

    buster.testCase("configDefaultsTest", {
        setUp: function () {
            this.gitjs = new G();
        },
        tearDown: function () {
            delete this.gitJs;
        }
    });
}(GitJs));