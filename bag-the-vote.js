var Votes = new Meteor.Collection("votes");

if (Meteor.isClient) {
    Template.users.users = function() {
        return Meteor.users.find();
    };

    Template.meta.events({
        'click #current-user img': function(event) {
            var jiraEmail = prompt("What is your JIRA email?");
            if (jiraEmail) {
                Meteor.users.update(
                    Meteor.user()._id,
                    {$set: {'profile.jiraEmail': jiraEmail}}
                );
            }
        }
    });

    Template.talks.votable = function() {
        var talk = Talks.findOne(this._id);
        console.log(talk.votes.voters);
        if (!_.find(talk.votes.voters, function(voter) {
            return (
                voter.email == Meteor.user().services.google.emailAddress
                || voter.email == Meteor.user().profile.jiraEmail
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
            console.log(this._id);
            var talk = Talks.findOne(this._id);
            console.log(talk);
            talk.votes.voters.push({user: Meteor.user});
            talk.votes.votes = talk.votes.voters.length;
            Talks.update(talk._id, talk);
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        Talks.sync();
        Talks.syncVotes();
    });
}
