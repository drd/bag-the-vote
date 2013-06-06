Talks = new Meteor.Collection("talks");

Talks.sync = function() {
    Jira.get(
        '/search?jql=Project=BB',
        function(error, result) {
            if (result.statusCode == 200) {
                _(result.data.issues).each(function(talk) {
                    if (Talks.findOne({"jira.id": talk.id})) {
                        console.log("Found ", talk.fields.summary);
                        return;
                    }

                    if (talk.fields.status.name == 'Resolved') {
                        console.log("Skipping resolved talk", talk.fields.summary);
                        return;
                    }

                    var id = talk.fields.reporter.emailAddress,
                        user;

                    // look for user
                    if (!(user = Meteor.users.findOne({"services.google.email": talk.fields.reporter.emailAddress }))) {
                        user = talk.fields.reporter;
                    }
                    Talks.insert({
                        name: talk.fields.summary,
                        user: user,
                        createdOn: talk.fields.created,
                        jira: talk
                    });
                });
            }
        }
    );

};

Talks.syncVotes = function() {
    _.each(Talks.find().fetch(), function(talk) {
        var votesUrl = talk.jira.fields.votes.self;

        Jira.get(votesUrl, function(error, result) {
            talk.votes = {
                jira: result.data,
                count: result.data.votes,
                voters: []
            };
            _.each(talk.votes.jira.voters, function(voter) {
                Jira.get(voter.self, function(error, result) {
                    talk.votes.voters.push({
                        jira: result.data,
                        email: result.data.emailAddress,
                        name: result.data.name
                    });

                    // ewww
                    Talks.update(talk._id, talk);
                });
            });
            Talks.update(talk._id, talk);
        });
    });
};