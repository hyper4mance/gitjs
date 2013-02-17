(function (G) {
    'use strict';

    module('Constructor Tests', {
        setup: function () {
            this.gitJs = new G();
        },
        teardown: function () {
            delete this.gitJs;
        }
    });

    test('test that this.gitjs is instance of GitJS', function () {
            ok(this.gitJs instanceof G);
    });

    test('test that this.gitjs constructor is GitJs', function () {
        ok(this.gitJs.constructor, G);
    });

}(GitJs));