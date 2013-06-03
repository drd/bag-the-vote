Jira = this.Jira || {};

Jira.get = function(url, callback) {
    if (!url.match(/^https?:\/\//)) {
        url = Jira.url + url;
    }

    return Meteor.http.get(
        url,
        { auth: Jira.auth },
        callback
    );
};