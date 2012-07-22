function testSetUp(G) {
    'use strict';

    var me = this;

    this.$get = $.get;
    this.$post = $.post;
    $.get = function () {
        $.get.called = true;
    };
    $.post = function () {
        $.post.called = true;
    };
    this.gitjs = new G();
    this.generateApiRequestOriginal = this.gitjs.generateApiRequest;
    this.gitjs.generateApiRequest = function (apiCommand, data, httpVerb, dataType) {
        var request = me.generateApiRequestOriginal.apply(new GitJs(), arguments);
        request.send = function () {
            me.gitjs.sendApiRequestCalled = true;
        };
        me.apiRequest = request;
        return request;
    };
}