function showUserInfo(userObject) {
    'use strict';
    var userInfo = $('#user_info'),
        username = userInfo.find('#username'),
        avatar = userInfo.find('#avatar'),
        email = userInfo.find('#email'),
        blog = userInfo.find('#blog'),
        userData = userObject.data;

    avatar.attr('src', 'http://www.gravatar.com/avatar/' + userData.gravatar_id + '?s=260');
    email.html(userData.email);
    blog.html(userData.blog);
    username.html(userData.login);
}

$(document).ready(function () {
    'use strict';
    $('form').bind('submit', function () {
        var gitJs = new GitJs({
            accessToken: $('input[name=access_token]').val()
        });
        gitJs.authenticateUser(function (data, text, jqXhr) {
            showUserInfo(data);
        });
        return false;
    });
});