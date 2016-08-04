Meteor.publish('workflows', function (bufeteId) {
	check(bufeteId, String);

	if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )) {
		return Workflows.find({bufeteId: bufeteId});
	} else {
		this.stop();
		return;
	}
});
