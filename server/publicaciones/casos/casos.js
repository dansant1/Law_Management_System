Meteor.publish('casos2', function (bufeteId) {
	check(bufeteId, String);

	if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
			return Casos.find({'bufeteId': bufeteId});
			
	} else {
		this.stop();
		return;
	}

});