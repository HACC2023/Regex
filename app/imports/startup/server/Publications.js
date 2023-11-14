import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { AskUs } from '../../api/askus/AskUs';

// Publishes the top 8 most frequently visited sites.
Meteor.publish(AskUs.userPublicationName, function () {
  return AskUs.collection.find(
    {},
    { sort: { freq: -1 }, limit: 8 },
  );
});

// Admin-level publication.
// If logged in and with admin role, then publish all documents from all users. Otherwise, publish nothing.
Meteor.publish(AskUs.adminPublicationName, function () {
  if (Roles.userIsInRole(this.userId, 'admin')) {
    return AskUs.collection.find();
  }
  return this.ready();
});

// alanning:roles publication
// Recommended code to publish roles for each user.
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  return this.ready();
});
