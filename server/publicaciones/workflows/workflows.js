Meteor.publish('workflows', function (bufeteId) {

	if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )) {
		return Workflows.find({bufeteId: Meteor.users.findOne(this.userId).profile.bufeteId});
	} else {
		this.stop();
		return;
	}
});
