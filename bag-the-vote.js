var Talks = new Meteor.Collection("talks");
var Votes = new Meteor.Collection("votes");

if (Meteor.isClient) {
    Template.users.users = function() {
        return Meteor.users.find();
    };

    Template.hello.greeting = function () {
        return "Welcome to bag-the-vote.";
    };

    Template.hello.events({
        'click input' : function () {
            // template data, if any, is available in 'this'
            if (typeof console !== 'undefined')
                console.log("You pressed the button", Meteor.user());
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
