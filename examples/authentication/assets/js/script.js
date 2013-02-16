/*global $: true, document: true, GitJs: true, window: true */

(function () {
    'use strict';
    function showUserInfo(userObject) {
        var userData = userObject.data,
            userInfo = $('#user_info'),
            username = userInfo.find('#username'),
            avatar = userInfo.find('#avatar'),
            email = userInfo.find('#email'),
            blog = userInfo.find('#blog'),
            avatarUrl = 'http://www.gravatar.com/avatar/' + userData.gravatar_id,
            largeAvatarParam = '?s=260',
            smallAvatarParam = '?s=14';

        userInfo.show('explode', 500);
        avatar.attr('src', avatarUrl + largeAvatarParam);
        email.html(userData.email);
        blog.html(userData.blog);
        username.html(userData.login);
    }

    function generateScopeString() {
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
        var req = $.ajax({
            url: 'http://localhost:8888/checkStatus',
            dataType: 'jsonp',
            timeout: 500,
            success: success,
            error: error
        });
    }

    function storeUserData(userData, accessToken) {
        userData.accessToken = accessToken;
        $.totalStorage('user', userData.data);
    }

    $(document).ready(function () {
        $('div.alert-success').hide();
        $('div.alert-important').hide();
        $('span.label-warning').tooltip({title: 'Keep this information secure. Do not share it with anyone!'});
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
}());

