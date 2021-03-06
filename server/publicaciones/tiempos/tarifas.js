Meteor.publish('tarifas', function (bufeteId) {
	check(bufeteId, String);

	if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )) {
		return Tarifas.find({bufeteId: bufeteId});
	} else {
		this.stop();
		return;
	}
});
