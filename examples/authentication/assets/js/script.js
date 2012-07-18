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
    warningLabel.tooltip({title: 'Keep this information secure. Do not share it with anyone!'});
    avatar.attr('src', 'http://www.gravatar.com/avatar/' + userData.gravatar_id + '?s=260');
    email.html(userData.email);
    blog.html(userData.blog);
    username.html(userData.login);
}

function generateScopeString() {
    'use strict';
    var scopes = [];
    $("input[name='scope[]']").each(function (index, element) {
        var me = $(this);
        if ($(element).is(':checked') === true) {
            scopes.push(me.val());
        }
    });
    return scopes.join(',');
}

function success(data, text, jqXhr) {
    'use strict';

    var warningLabel = $('div.alert-error'),
        successLabel = $('div.alert-success'),
        loginButton = $('button');

    if (warningLabel.is(':visible') === true) {
        warningLabel.fadeOut(500, function () {
            successLabel.fadeIn(500);
        });
    }
    loginButton.removeAttr('disabled');
}

function error(jqXhr, status, errorThrown) {
    'use strict';

    var warningLabel = $('div.alert-error'),
        successLabel = $('div.alert-success'),
        loginButton = $('button');

    if (warningLabel.is(':visible') === false) {
        warningLabel.fadeIn(500);
    } else {
        warningLabel.effect('pulsate', {times: 3}, 1000);
    }
    loginButton.attr('disabled', 'disabled');
}
function checkServerStatus(callback) {
    'use strict';

    var req = $.ajax({
        url: 'http://localhost:8888/checkStatus',
        dataType: 'jsonp',
        timeout: 500,
        jsonpCallback: 'success',
        error: error
    });
}

$(document).ready(function () {
    'use strict';
    $('div.alert-success').hide();
    $('div.alert-error').hide();

    checkServerStatus();
    $('#check_server_status_link').click(function (e) {
        checkServerStatus();
        return false;
    });

    $("input[name='scope[]']").click(function () {
        $('#access_token').val('');
    });

    $('form').bind('submit', function () {
        var accessToken = $('#access_token'),
            clientId = '9161914a06ffaf898a7e',
            appSecret = '22689d87189698f4bbf05c90585b9ff7bd8602e7',
            gitJs = new GitJs({clientId: clientId}),
            scope = generateScopeString(),
            authWindow,
            authorizationUrl = gitJs.generateAuthorizationLink(clientId, {
                scope: generateScopeString()
            });

        if (accessToken.val().length === 0) {
            authWindow = window.open(authorizationUrl, 'authorizationExample');
            authWindow.opener.focus();
            $(window).bind('message', function (e) {
                var dataPieces = e.originalEvent.data.split('=');
                authWindow.close();
                if (dataPieces[0] === 'access_token') {
                    accessToken.val(dataPieces[1].split('&')[0]);
                    gitJs.authenticateUser(function (data, text, jqXhr) {
                        showUserInfo(data);
                    }, accessToken.val());
                }
            });
        } else {
            gitJs.authenticateUser(function (data, text, jqXhr) {
                showUserInfo(data);
            }, accessToken.val());
        }
        return false;
    });
});