# Bag the Vote

A little fun with Meteor to track votes for Idealist.org's weekly Brown Bag Lunch Talks.


## Dependencies

Because smart packages are awesome, we're using meteorite and the atmosphere package index. To wit:

```
sudo npm install -g meteorite
cd bag-the-vote && mrt
```


## Notes

### JIRA integration

In config/jira.js, add your JIRA url and user/pass (assuming you're using https, otherwise... hacks). In lib/jira.js, there is a convenience wrapper for Meteor.http.get to use the JIRA credentials and to take relative API urls, which will be concatenated to the base url.

### DB Schema

All JIRA responses are saved in whole under the jira key of each node. So, talks have their response saved at the top level talk.jira, and since voter responses are fetched, talk.votes.voters each have a .jira key.

### User accounts and JIRA emails

Bag the Vote uses the meteor.accounts/google plugin, so if your Google account happens to have a different email address from your JIRA account, you'll need to set it. You can do this (jankily) by clicking on your name after you've logged in... prompt() ftw!

