import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';
import { AskUs } from '../../api/askus/AskUs';
import { Visits } from '../../api/visit/Visits';

// Publishes page visit collection.
Meteor.publish(Visits.userPublicationName, function () {
  return Visits.collection.find();
});

// Publishes the top 8 most frequently visited sites.
Meteor.publish(AskUs.userPublicationName, function () {
  return AskUs.collection.find(
    {},
    { sort: { freq: -1 }, limit: 8 },
  );
});

// Admin-level publication.
// If logged in and with admin role, then publish all documents from all users. Otherwise, publish nothing.
Meteor.publish(AskUs.adminPublicationName, function (start, num) {
  check(start, Number);
  check(num, Number);

  if (Roles.userIsInRole(this.userId, 'admin')) {
    return AskUs.collection.find(
      {},
      { sort: { filename: 1 }, skip: start, limit: num },
    );
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
