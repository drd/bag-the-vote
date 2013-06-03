var Votes = new Meteor.Collection("votes");

if (Meteor.isClient) {
    Template.users.users = function() {
        return Meteor.users.find();
    };

    Template.talks.votable = function() {
        var talk = Talks.findOne(this._id);
        console.log(talk.votes.voters);
        if (!_.find(talk.votes.voters, function(voter) {
            return voter.displayName == Meteor.user().profile.name;
        })) {
            return true;
        }
    };

    Template.talks.talks = function() {
        return Talks.find({}, {
            sort: {
                'votes.votes': '-1',
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
        // code to run on server at startup
    });
}
