var fs = require('fs');
var format = require('string-format');

var dateFormat = require('dateformat');

hbs.registerHelper('selected_if', function (lvalue, rvalue, options) {
    if (lvalue == rvalue) {
        return "selected";
    }
    return options.fn(this);
});



hbs.registerHelper('comment_helper', function (string) {
    return new hbs.SafeString(string);
});



hbs.registerHelper('notification_message', function (data) {
    var output = '';
    if (data) {
        output = data.notification_type == NotificationType.Rejected ? " rejected the commit " : " commented on commit ";
    }
    return new hbs.SafeString(output);
});

hbs.registerHelper('commit_url_notification', function (data) {
    var output = '';
    if (data) {
        var base_url = process.env.BASE_URL || format("{}://{}", req.protocol, req.get('host'))
        output = format("{}/commit?id={}&sha={}&name={}", base_url, common.urlEncrypt(data.repository_id), data.commit.dataValues.short_sha, data.repository.dataValues.name);
    }
    return new hbs.SafeString(output);
});

hbs.registerHelper('repodetail_url_notification', function (data) {
    var output = '';
    if (data) {
        var base_url = process.env.BASE_URL || format("{}://{}", req.protocol, req.get('host'))
        output = format("{}/repodetail?id={}&name={}", base_url, common.urlEncrypt(data.repository_id), common.urlEncrypt(data.repository.dataValues.name));
    }
    return new hbs.SafeString(output);
});

//common method for conditions to return true false results
hbs.registerHelper('ifvalue', function (conditional, options) {
    if (conditional == options.hash.equals) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

hbs.registerHelper('haveRecord', function (data, options) {
    if (data && data.length > 0) {
        return options.fn(this);
    } else {
        return new hbs.SafeString(`<div class="alert alert-warning">No record found. </div>`);
    }
});

//common method for conditions to return true false results
hbs.registerHelper('dateFormat', function (date, format) {
    return new hbs.SafeString(dateFormat(new Date(date), format));
});