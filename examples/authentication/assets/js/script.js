/*global $: true, document: true, GitJs: true, window: true */
function showUserInfo(userObject) {
    'use strict';
    var userInfo = $('#user_info'),
        username = userInfo.find('#username'),
        avatar = userInfo.find('#avatar'),
        email = userInfo.find('#email'),
        blog = userInfo.find('#blog'),
        warningLabel = $('span.label-important'),
        userData = userObject.data;

    userInfo.show('explode', 500);
    warningLabel.toolTip('yo mama');
    avatar.attr('src', 'http://www.gravatar.com/avatar/' + userData.gravatar_id + '?s=260');
    email.html(userData.email);
    blog.html(userData.blog);
    username.html(userData.login);
}

function generateScopeString() {
    'use strict';
    var scopes = [];
    $('input[type=checkbox,name=scope').each(function (index, element) {
        var me = $(this);
        if ($(element).checked() === true) {
            scopes.push(me.val());
        }
    });
    return scopes.join(',');
}

function checkServerStatus(callback) {
    'use strict';
    var warningLabel = $('div.alert-error'),
        loginButton = $('button');
    $.ajax({
        url: 'http://localhost:8888',
        success: function (data, text, jqXhr) {
            if (warningLabel.is(':visible') === true) {
                warningLabel.fadeOut(500);
                loginButton.enable();
                callback();
            }
        },
        error: function (jqXhr, status, errorThrown) {
            if (warningLabel.is(':visible') === false) {
                warningLabel.fadeIn(500);
            } else {
                warningLabel.pulsate({times: 3}, 2000);
            }
            loginButton.disable();
        }
    });
}

$(document).ready(function () {
    'use strict';

    $('form').bind('submit', function () {
        var accessToken = $('#access_token').val(),
            clientId = '9161914a06ffaf898a7e',
            appSecret = '22689d87189698f4bbf05c90585b9ff7bd8602e7',
            gitJs = new GitJs({clientId: clientId}),
            scope = generateScopeString();

        checkServerStatus(function () {
            if (accessToken) {
                gitJs.authenticateUser(function (data, text, jqXhr) {
                    showUserInfo(data);
                }, accessToken);
            } else {
                window.open(gitJs.generateAuthorizationLink(clientId, {
                    scope: scope || undefined
                }));
            }
        });

        return false;
    });
});