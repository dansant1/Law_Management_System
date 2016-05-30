Template.menu.events({
	'click .logout': () => {
		Meteor.logout();
	}
});

Template.menu.helpers({
	nombre: function () {
		return Meteor.users.findOne({});
	}
});