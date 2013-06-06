var Votes = new Meteor.Collection("votes");

if (Meteor.isClient) {
    Template.users.users = function() {
        return Meteor.users.find();
    };

    Template.meta.events({
        'click #current-user img': function(event) {
            var jiraEmail = prompt(
                "What is your JIRA email?",
                Meteor.user().jiraEmail
            );
            if (jiraEmail) {
                Meteor.users.update(
                    Meteor.user()._id,
                    {$set: {'profile.jiraEmail': jiraEmail}}
                );
            }
        }
    });

    Template.talks.votable = function() {
        var talk = talk || Talks.findOne(this._id),
            user = Meteor.user();
        if (_.find(talk.votes.voters, function(voter) {
            return (
                voter.email == user.services.google.email ||
                voter.email == user.profile.jiraEmail
            );
        })) {
            return true;
        }
    };

    Template.talks.moment = function(time) {
        return moment(time).fromNow();
    };

    Template.talks.talks = function() {
        return Talks.find({}, {
            sort: {
                'votes.count': '-1',
                'name': '1'
            }
        }).fetch();
    };

    Template.talks.events({
        'click button': function(event) {
            var talk = Talks.findOne(this._id);
            var user = Meteor.user();
            Talks.update(talk._id, {
                $inc: { 'votes.count': 1 },
                $push: {
                    'votes.voters': {
                        name: user.profile.name,
                        email: user.services.google.email,
                        user: Meteor.user()
                    }
                }
            });
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        Talks.sync();
        Talks.syncVotes();
    });
}
